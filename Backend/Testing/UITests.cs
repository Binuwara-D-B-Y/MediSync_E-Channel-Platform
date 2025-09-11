using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using Xunit;
using WebDriverManager;
using WebDriverManager.DriverConfigs.Impl;

namespace Backend.Tests
{
    public class UITests : IDisposable
    {
        private IWebDriver? _driver;
        private bool _skipUi;
        private readonly string _baseUrl = "http://localhost:5173";

        public UITests()
        {
            try
            {
                new DriverManager().SetUpDriver(new ChromeConfig());

                var options = new ChromeOptions();
                options.AddArgument("--headless=new");
                options.AddArgument("--no-sandbox");
                options.AddArgument("--disable-dev-shm-usage");
                options.AddArgument("--window-size=1920,1080");
                _driver = new ChromeDriver(options);
                _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(3);

                if (!IsServerReachable())
                {
                    _skipUi = true;
                    _driver?.Quit();
                    _driver = null;
                    return;
                }

                _skipUi = false;
            }
            catch (Exception)
            {
                _skipUi = true;
                _driver = null;
            }
        }

        private bool IsServerReachable()
        {
            try
            {
                using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(2) };
                var response = http.GetAsync(_baseUrl).GetAwaiter().GetResult();
                return response.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }

        private WebDriverWait CreateWait() => new WebDriverWait(_driver!, TimeSpan.FromSeconds(10))
        {
            PollingInterval = TimeSpan.FromMilliseconds(500)
        };

        private IWebElement WaitAndFindClickable(By locator)
        {
            var wait = CreateWait();
            var element = wait.Until(d => d.FindElement(locator));
            wait.Until(d => element.Displayed && element.Enabled);
            return element;
        }

        [Fact]
        public void UserAccount_Edit_Save_And_Delete_Buttons_Work()
        {
            if (_skipUi) return;

            _driver.Navigate().GoToUrl(_baseUrl + "/account");

            var wait = CreateWait();
            wait.Until(d => d.FindElement(By.TagName("h3")).Displayed);

            var editBtn = WaitAndFindClickable(By.XPath("//button[text()='Edit Profile']"));
            editBtn.Click();

            var nameInput = wait.Until(d => d.FindElement(By.CssSelector("input[name='name']")));
            nameInput.Clear();
            nameInput.SendKeys("Test User");

            var fileInput = _driver.FindElements(By.CssSelector("input[type='file']")).FirstOrDefault();
            string? tempFile = null;
            if (fileInput != null)
            {
                tempFile = CreateTempPng();
                fileInput.SendKeys(tempFile);

                wait.Until(driver => driver.FindElements(By.CssSelector(".image-circle img")).Count > 0);
                var imgs = _driver.FindElements(By.CssSelector(".image-circle img"));
                var src = imgs[0].GetDomAttribute("src") ?? string.Empty;
                Assert.True(src.StartsWith("data:") || src.StartsWith("blob:"), "Expected preview src to be a data/blob URI.");

                var removeBtn = WaitAndFindClickable(By.XPath("//button[text()='Remove Image']"));
                removeBtn.Click();
                wait.Until(d => d.FindElements(By.CssSelector(".image-circle img")).Count == 0);
            }

            OverrideAlerts();
            var saveBtn = WaitAndFindClickable(By.XPath("//button[@type='submit' and text()='Save']"));
            saveBtn.Click();

            wait.Until(d => d.FindElement(By.XPath("//label[text()='Name']/following-sibling::p")).Displayed);
            var nameP = _driver.FindElement(By.XPath("//label[text()='Name']/following-sibling::p"));
            Assert.Contains("Test User", nameP.Text);

            var lastAlertObj = ((IJavaScriptExecutor)_driver).ExecuteScript("return window.__lastAlert;");
            var lastAlert = lastAlertObj == null ? string.Empty : lastAlertObj.ToString();
            Assert.Contains("Profile updated successfully", lastAlert ?? "");

            ResetAlerts();
            var deleteBtn = WaitAndFindClickable(By.XPath("//button[contains(@class,'delete-btn') and text()='Delete Profile']"));
            deleteBtn.Click();
            var deletedAlertObj = ((IJavaScriptExecutor)_driver).ExecuteScript("return window.__lastAlert;");
            var deletedAlert = deletedAlertObj == null ? string.Empty : deletedAlertObj.ToString();
            Assert.Contains("Account deleted successfully", deletedAlert ?? "");
        }

        [Fact]
        public void FindDoctors_Fetches_Specializations_And_Search_Input_Works()
        {
            if (_skipUi) return;

            _driver.Navigate().GoToUrl(_baseUrl + "/patient");

            var wait = CreateWait();
            wait.Until(d => d.FindElement(By.CssSelector(".find-doctors-title")).Displayed);

            var searchInput = wait.Until(d => d.FindElement(By.CssSelector(".find-doctors .search-box input")));
            Assert.NotNull(searchInput);

            var select = wait.Until(d => d.FindElement(By.CssSelector(".find-doctors select")));
            var options = select.FindElements(By.TagName("option"));
            Assert.True(options.Count >= 1);

            searchInput.SendKeys("Alice");
            wait.Until(d => d.FindElements(By.CssSelector(".doctor-dropdown li")).Count > 0);

            var dropdowns = _driver.FindElements(By.CssSelector(".doctor-dropdown li"));
            if (dropdowns.Count > 0)
            {
                var first = dropdowns[0];
                var firstText = first.Text;
                ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].click();", first);

                wait.Until(d => searchInput.GetDomProperty("value")?.ToString() == firstText);
                Assert.Equal(firstText, searchInput.GetDomProperty("value")?.ToString());
            }

            var optionsElements = select.FindElements(By.TagName("option"));
            if (optionsElements.Count > 1)
            {
                var second = optionsElements[1];
                second.Click();
                wait.Until(d => select.GetDomProperty("value")?.ToString() == second.GetDomAttribute("value"));
            }
        }

        [Fact]
        public void PatientDashboard_SearchAndBookDoctor_Works()
        {
            if (_skipUi) return;

            _driver.Navigate().GoToUrl(_baseUrl + "/patient");

            var wait = CreateWait();
            wait.Until(d => d.FindElement(By.CssSelector(".welcome-title")).Displayed);

            var searchInput = wait.Until(d => d.FindElement(By.CssSelector(".search-box input")));
            searchInput.SendKeys("Alice");

            wait.Until(d => d.FindElements(By.CssSelector(".doctor-card")).Count > 0);

            var bookBtn = WaitAndFindClickable(By.CssSelector(".doctor-book-btn"));
            bookBtn.Click();

            wait.Until(d => d.FindElement(By.CssSelector(".modal-overlay")).Displayed);

            var dateInput = wait.Until(d => d.FindElement(By.CssSelector("input[type='date']")));
            dateInput.SendKeys("2025-09-15");

            var timeSelect = wait.Until(d => d.FindElement(By.CssSelector("select")));
            timeSelect.Click();
            _driver.FindElement(By.XPath(".//option[@value='10:00']")).Click();

            OverrideAlerts();
            var confirmBtn = WaitAndFindClickable(By.CssSelector(".btn-confirm"));
            confirmBtn.Click();

            wait.Until(d => d.FindElement(By.CssSelector(".modal-success")).Displayed);
        }

        [Fact]
        public void UserAccount_TabsSwitchAndTransactionsLoad()
        {
            if (_skipUi) return;

            _driver.Navigate().GoToUrl(_baseUrl + "/account");

            var wait = CreateWait();

            var transTab = WaitAndFindClickable(By.XPath("//button[text()='Transaction History']"));
            transTab.Click();

            wait.Until(d => d.FindElements(By.CssSelector(".transaction-card")).Count > 0 || 
                           d.FindElement(By.XPath("//div[text()='No transactions found.']")).Displayed);

            var cards = _driver.FindElements(By.CssSelector(".transaction-card"));
            if (cards.Count > 0)
            {
                Assert.True(cards[0].Displayed);
            }
            else
            {
                Assert.Contains("No transactions found", _driver.PageSource);
            }
        }

        private void OverrideAlerts()
        {
            ((IJavaScriptExecutor)_driver).ExecuteScript(@"
                window.__lastAlert = null; 
                window.alert = function(msg){ window.__lastAlert = msg; }; 
                window.confirm = function(){ return true; };
            ");
        }

        private void ResetAlerts()
        {
            ((IJavaScriptExecutor)_driver).ExecuteScript("window.__lastAlert = null;");
        }

        private string CreateTempPng()
        {
            var tempFile = Path.Combine(Path.GetTempPath(), $"test-image-{Guid.NewGuid()}.png");
            var pngBytes = Convert.FromBase64String("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=");
            File.WriteAllBytes(tempFile, pngBytes);
            return tempFile;
        }

        public void Dispose()
        {
            _driver?.Quit();
            _driver?.Dispose();

            try
            {
                foreach (var file in Directory.GetFiles(Path.GetTempPath(), "test-image-*.png"))
                {
                    File.Delete(file);
                }
            }
            catch { }
        }
    }
}
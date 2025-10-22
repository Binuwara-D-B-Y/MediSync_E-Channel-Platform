# BookingService and PaymentService Detailed Explanation

## BookingService Overview

The `BookingService` is the core business logic layer that orchestrates the entire appointment booking workflow. It coordinates between multiple repositories and services to ensure data consistency and business rule enforcement.

### Dependencies
- `IAppointmentRepository` - Manages appointment data
- `ITransactionRepository` - Manages transaction records
- `IDoctorScheduleRepository` - Manages doctor schedules and availability
- `IPaymentService` - Handles payment processing

## BookingService Functions

### 1. CreateBookingAsync(BookingRequestDto request, int patientId)

**Purpose**: Main function that handles the complete booking workflow from validation to transaction recording.

**Step-by-Step Process**:

#### Step 1: Input Validation
```csharp
var schedule = await _scheduleRepo.GetByIdAsync(request.ScheduleId);
if (schedule == null)
    throw new ArgumentException("Schedule not found");
```
- Validates that the requested schedule exists
- Ensures the schedule ID is valid

#### Step 2: Availability Check
```csharp
if (schedule.AvailableSlots <= 0)
    throw new InvalidOperationException("No available slots");
```
- Checks if there are available appointment slots
- Prevents overbooking

#### Step 3: Payment Processing
```csharp
var paymentId = await _paymentService.ProcessPaymentAsync(request.Payment);
```
- Delegates payment processing to PaymentService
- Receives unique payment ID for tracking

#### Step 4: Appointment Creation
```csharp
var appointment = new Appointment
{
    PatientId = patientId,
    ScheduleId = request.ScheduleId,
    PatientName = request.PatientName,
    PatientContact = request.ContactNo,
    SlotNumber = schedule.TotalSlots - schedule.AvailableSlots + 1,
    Status = AppointmentStatus.booked,
    CreatedAt = DateTime.Now,
    UpdatedAt = DateTime.Now
};
var createdAppointment = await _appointmentRepo.CreateAsync(appointment);
```
- Creates appointment entity with patient details
- Calculates slot number based on availability
- Sets status to 'booked'
- Saves to database and gets generated ID

#### Step 5: Transaction Recording
```csharp
var transaction = new Transaction
{
    AppointmentId = createdAppointment.AppointmentId,
    PatientId = patientId,
    PaymentId = paymentId,
    NIC = request.NIC,
    ContactNo = request.ContactNo,
    Email = request.Email,
    Amount = request.Payment.Amount,
    Status = TransactionStatus.completed,
    PaymentMethod = "bank-transfer",
    BankName = request.Payment.BankName,
    BankBranch = request.Payment.BankBranch
};
var createdTransaction = await _transactionRepo.CreateAsync(transaction);
```
- Creates transaction record linking appointment and payment
- Stores patient details for audit trail
- Records payment information
- Sets transaction status to completed

#### Step 6: Schedule Update
```csharp
schedule.AvailableSlots--;
await _scheduleRepo.UpdateAsync(schedule);
```
- Decrements available slots
- Updates schedule in database

#### Step 7: Response Generation
```csharp
return new BookingResponseDto
{
    AppointmentId = createdAppointment.AppointmentId,
    TransactionId = createdTransaction.TransactionId,
    PaymentId = paymentId,
    Status = TransactionStatus.completed,
    Amount = request.Payment.Amount,
    PaymentDate = createdTransaction.PaymentDate,
    Message = "Booking successful"
};
```
- Returns comprehensive booking confirmation
- Includes all relevant IDs for tracking

### 2. GetBookingAsync(int appointmentId)

**Purpose**: Retrieves booking details for a specific appointment.

**Process**:
1. **Fetch Appointment**: Gets appointment by ID with transaction details
2. **Validation**: Checks if appointment and transaction exist
3. **Response Mapping**: Converts to BookingResponseDto format

```csharp
var appointment = await _appointmentRepo.GetByIdAsync(appointmentId);
if (appointment?.Transaction == null)
    return null;

return new BookingResponseDto { /* mapping */ };
```

### 3. GetUserAppointmentsAsync(int patientId)

**Purpose**: Retrieves all appointments for a specific patient with detailed information.

**Process**:
1. **Fetch User Appointments**: Gets all appointments for patient
2. **Data Transformation**: Maps to UserAppointmentDto with doctor and payment details
3. **Information Enrichment**: Adds doctor name, specialization, payment info

```csharp
var appointments = await _appointmentRepo.GetByPatientIdAsync(patientId);

return appointments.Select(a => new UserAppointmentDto
{
    AppointmentId = a.AppointmentId,
    Doctor = a.DoctorSchedule?.Doctor?.FullName ?? "Unknown",
    Specialization = a.DoctorSchedule?.Doctor?.Specialization ?? "Unknown",
    Price = a.Transaction?.Amount ?? 0,
    // ... other mappings
}).ToList();
```

## PaymentService Overview

The `PaymentService` handles payment processing operations. Currently implements a simulation layer but designed for easy integration with real payment gateways.

### PaymentService Functions

### 1. ProcessPaymentAsync(PaymentDetailsDto paymentDetails)

**Purpose**: Processes payment and returns a unique payment ID.

**Step-by-Step Process**:

#### Step 1: Payment Simulation
```csharp
await Task.Delay(100);
```
- Simulates network delay for payment processing
- In real implementation, this would call payment gateway API

#### Step 2: Payment ID Generation
```csharp
var paymentId = $"PAY_{DateTime.Now:yyyyMMddHHmmss}_{Guid.NewGuid().ToString("N")[..8]}";
```
- Generates unique payment ID with timestamp
- Format: PAY_YYYYMMDDHHMMSS_8CHARGUID
- Ensures uniqueness and traceability

#### Step 3: Return Payment ID
```csharp
return paymentId;
```
- Returns payment ID for transaction recording
- Used for payment tracking and reconciliation

### 2. ValidatePaymentAsync(string paymentId)

**Purpose**: Validates if a payment ID is legitimate and payment was successful.

**Process**:
1. **Simulation Delay**: Mimics validation API call
2. **Basic Validation**: Checks if payment ID is not null/empty
3. **Return Status**: Returns boolean indicating payment validity

```csharp
await Task.Delay(50);
return !string.IsNullOrEmpty(paymentId);
```

## Service Integration Flow

### Complete Booking Workflow
1. **User Input** → BookingController receives request
2. **Service Call** → BookingService.CreateBookingAsync()
3. **Validation** → Check schedule availability
4. **Payment** → PaymentService.ProcessPaymentAsync()
5. **Data Creation** → Create appointment and transaction
6. **Update** → Reduce available slots
7. **Response** → Return booking confirmation

### Error Handling Strategy
- **Try-Catch Blocks**: Comprehensive error catching in BookingService
- **Logging**: Console logging for debugging
- **Exception Propagation**: Meaningful exceptions thrown to controller
- **Transaction Rollback**: Implicit through Entity Framework

### Design Benefits
- **Separation of Concerns**: Each service has specific responsibility
- **Testability**: Services can be unit tested independently
- **Maintainability**: Easy to modify payment logic without affecting booking
- **Scalability**: Can easily add new payment providers or booking rules
- **SOLID Principles**: Follows dependency inversion and single responsibility
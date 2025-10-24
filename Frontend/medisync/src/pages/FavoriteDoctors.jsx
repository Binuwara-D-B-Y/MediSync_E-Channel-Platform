import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { favoritesAPI } from '../api';
import FavoriteButton from '../components/FavoriteButton';
import '../styles/FavoriteDoctors.css';

// Page showing all doctors the user has favorited
export default function FavoriteDoctors() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user's favorite doctors when page opens
  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const favorites = await favoritesAPI.getFavorites();
      console.log('Favorites received:', favorites);
      setFavorites(Array.isArray(favorites) ? favorites : []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      // Handle auth errors but don't auto-redirect
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        console.log('User not authenticated for favorites');
      }
    } finally {
      setLoading(false);
    }
  };

  // When user removes a favorite, update the list immediately
  const handleFavoriteToggle = (doctorId, isFavorite, message) => {
    if (!isFavorite) {
      setFavorites(prev => prev.filter(fav => fav.doctor?.doctorId !== doctorId));
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Loading your favorite doctors...</div>
      </div>
    );
  }

  return (
    <div className="favorite-doctors">
      <div className="favorite-doctors-header">
        <Heart size={24} fill="#ef4444" color="#ef4444" />
        <h2>My Favorite Doctors</h2>
      </div>
      
      {favorites.length === 0 ? (
        <div className="no-favorites">
          <Heart size={48} color="#d1d5db" />
          <h3>No favorite doctors yet</h3>
          <p>Start adding doctors to your favorites to see them here.</p>
          <button 
            className="browse-doctors-btn"
            onClick={() => navigate('/patient')}
          >
            Browse Doctors
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((favorite) => {
            const doctor = favorite.doctor;
            if (!doctor) {
              console.log('No doctor data for favorite:', favorite);
              return null;
            }
            return (
              <div className="favorite-doctor-card" key={favorite.favoriteId}>
                <div className="favorite-header">
                  {/* Heart button to remove from favorites */}
                  <FavoriteButton
                    doctorId={doctor.doctorId}
                    initialIsFavorite={true}
                    onToggle={(isFav, msg) => handleFavoriteToggle(doctor.doctorId, isFav, msg)}
                  />
                </div>
                <div className="doctor-info">
                  <div className="doctor-image">
                    <img 
                      src="/assets/unnamed.png" 
                      alt={doctor.fullName}
                      onError={(e) => { e.currentTarget.src = 'src/assets/Elogo.png' }}
                    />
                  </div>
                  <div className="doctor-details">
                    <h3>{doctor.fullName}</h3>
                    <p className="specialization">{doctor.specialization}</p>
                    <p className="qualification">{doctor.qualification}</p>
                    <p className="contact">{doctor.email}</p>
                  </div>
                </div>
                <button 
                  className="book-appointment-btn"
                  onClick={() => navigate(`/book/${doctor.doctorId}`)}
                >
                  Book Appointment
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Settings = () => {
  const { id } = useParams();
  const history = useHistory();
  const [settings, setSettings] = useState({
    locatie: '',
    tijdstip: '08:00',
    windsnelheid: 3.0,
    regenkans: 25,
    min_temp: 5,
    max_temp: 30,
    kans_sneeuw: 10
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) {
      // Haal bestaande gegevens op als er een ID is
      const fetchSettings = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/weather/${id}`);
          setSettings(response.data);
        } catch (error) {
          console.error('Error fetching settings:', error);
          setError('Fout bij het ophalen van de instellingen. Probeer het later opnieuw.');
        }
      };
      fetchSettings();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    // Validatie
    if (!settings.locatie) {
      setError('Locatie is verplicht.');
      return;
    }

    if (settings.regenkans === '' || settings.kans_sneeuw === '' || settings.windsnelheid === '' || settings.min_temp === '' || settings.max_temp === '') {
      setError('Alle velden zijn verplicht in te vullen.');
      return;
    }

    if (Number(settings.min_temp) > Number(settings.max_temp)) {
      setError('Minimale temperatuur kan niet hoger zijn dan de maximale temperatuur.');
      return;
    }

    try {
      if (id) {
        // Update bestaande gegevens
        const response = await axios.put(`http://localhost:5000/api/weather/${id}`, settings);
        if (response.status === 200) {
          setSuccessMessage('Instellingen succesvol bijgewerkt!');
        } else {
          throw new Error('Failed to update settings');
        }
      } else {
        // Maak nieuwe gegevens aan
        const response = await axios.post('http://localhost:5000/api/weather/', settings);
        if (response.status === 201) {
          setSuccessMessage('Instellingen succesvol opgeslagen!');
          const newId = response.data.id;
          const storedIds = JSON.parse(localStorage.getItem('weatherSettingsIds')) || [];
          localStorage.setItem('weatherSettingsIds', JSON.stringify([...storedIds, newId]));
        } else {
          throw new Error('Failed to create settings');
        }
      }
      setTimeout(() => {
        history.push(`/locations/${id || settings.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Fout bij het opslaan van de instellingen. Probeer het later opnieuw.');
    }
  };

  const handleCancel = () => {
    history.push('/locations');
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="card p-4">
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        <div className="form-group">
          <label>Locatie:</label>
          <input type="text" name="locatie" value={settings.locatie} onChange={handleChange} required className="form-control" />
        </div>
        <div className="form-group">
          <label>Tijdstip van weerpeiling:</label>
          <input type="time" name="tijdstip" value={settings.tijdstip} onChange={handleChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Maximale windsnelheid (m/s):</label>
          <input type="number" name="windsnelheid" value={settings.windsnelheid} onChange={handleChange} className="form-control" required step="0.1" />
        </div>
        <div className="form-group">
          <label>Maximale regenkans (%):</label>
          <input type="number" name="regenkans" value={settings.regenkans} onChange={handleChange} className="form-control" required min="0" max="100" />
        </div>
        <div className="form-group">
          <label>Minimale temperatuur (°C):</label>
          <input type="number" name="min_temp" value={settings.min_temp} onChange={handleChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Maximale temperatuur (°C):</label>
          <input type="number" name="max_temp" value={settings.max_temp} onChange={handleChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Maximale kans op sneeuw (%):</label>
          <input type="number" name="kans_sneeuw" value={settings.kans_sneeuw} onChange={handleChange} className="form-control" required min="0" max="100" />
        </div>
        <button type="submit" className="btn btn-primary mr-2">Opslaan</button>
        <button type="button" onClick={handleCancel} className="btn btn-secondary">Annuleren</button>
      </form>
    </div>
  );
};

export default Settings;

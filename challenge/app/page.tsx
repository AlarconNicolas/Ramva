"use client";
import React, { useState } from "react";
import styles from "../styles/page.module.css";

// Formulario de búsqueda integrado
const SearchForm = ({ onSearch }) => {
  const [countryName, setCountryName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (countryName.trim()) {
      onSearch(countryName);
      setCountryName("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={countryName}
        onChange={(e) => setCountryName(e.target.value)}
        placeholder="Buscar país"
        required
      />
      <button type="submit">Buscar</button>
    </form>
  );
};

const HomePage = () => {
  // Estado para los datos del país
  const [countryData, setCountryData] = useState(null);

  // Estado para el mensaje de error
  const [error, setError] = useState<string | null>(null);

  // Función para buscar el país usando la API
  const handleSearch = async (countryName) => {
    setError(null);
    setCountryData(null);
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${countryName}`
      );
      if (!response.ok) {
        setError("País no encontrado.");
        return;
      }
      const data = await response.json();
      if (!data || data.status === 404 || !data[0]) {
        setError("País no encontrado.");
        return;
      }
      setCountryData(data[0]);
    } catch (error) {
      setError("Error al buscar el país.");
      console.error("Error fetching country data:", error);
    }
  };

  // Cierra el modal de información del país
  const handleClose = () => setCountryData(null);

  return (
    <div className={styles.background}>
      {/* Encabezado principal */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Country Search</h1>
      </header>
      <main>
        {/* Contenedor del formulario de búsqueda */}
        <div className={styles.formContainer}>
          <div className={styles.formBox}>
            {/* Formulario de búsqueda */}
            <SearchForm onSearch={handleSearch} />
            {/* Mensaje de error */}
            {error && <div className={styles.errorMsg}>{error}</div>}
          </div>
        </div>
        {/* Modal con la información del país */}
        {countryData && (
          <div className={styles.overlay}>
            <div className={styles.modal} style={{ position: "relative" }}>
              {/* Botón para cerrar el modal */}
              <button
                className={styles.closeBtn}
                onClick={handleClose}
                title="Cerrar"
              >
                &times;
              </button>
              {/* Bandera del país */}
              <img
                className={styles.flag}
                src={countryData.flags.svg}
                alt={`Bandera de ${countryData.name.common}`}
              />
              {/* Nombre del país */}
              <div className={styles.title}>{countryData.name.common}</div>
              {/* Detalles del país */}
              <div className={styles.detail}>
                <strong>Capital:</strong> {countryData.capital}
              </div>
              <div className={styles.detail}>
                <strong>Población:</strong>{" "}
                {countryData.population.toLocaleString()}
              </div>
              <div className={styles.detail}>
                <strong>Región:</strong> {countryData.region}
              </div>
              <div className={styles.detail}>
                <strong>Subregión:</strong> {countryData.subregion}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;

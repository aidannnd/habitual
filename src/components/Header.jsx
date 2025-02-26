import React from 'react';

function Header({ handleExportData, handleImportData }) {
  return (
    <header>
      <h1>habitual</h1>
      <p className="subtitle">Improve every day</p>
      <div className="data-buttons">
        <button 
          className="export-button"
          onClick={handleExportData}
        >
          Export
        </button>
        <label className="import-button">
          Import
          <input
            type="file"
            accept=".json"
            onChange={handleImportData}
            style={{ display: 'none' }}
          />
        </label>
      </div>
    </header>
  );
}

export default Header; 
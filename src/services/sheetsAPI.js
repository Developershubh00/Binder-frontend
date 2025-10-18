const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;

class SheetsAPI {
  // Fetch all data as JSON
  static async fetchData(range = 'Sheet1!A1:Z1000') {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sheets/${SPREADSHEET_ID}/json?range=${range}`
      );
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      throw new Error(data.error);
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  // Add new row
  static async addRow(values, range = 'Sheet1!A:Z') {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sheets/${SPREADSHEET_ID}/append`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            range,
            values: [values]
          })
        }
      );
      const data = await response.json();
      if (data.success) {
        return data;
      }
      throw new Error(data.error);
    } catch (error) {
      console.error('Error adding row:', error);
      throw error;
    }
  }

  // Update existing row
  static async updateRow(range, values) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sheets/${SPREADSHEET_ID}/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            range,
            values: [values]
          })
        }
      );
      const data = await response.json();
      if (data.success) {
        return data;
      }
      throw new Error(data.error);
    } catch (error) {
      console.error('Error updating row:', error);
      throw error;
    }
  }

  // Delete/Clear row
  static async clearRow(range) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sheets/${SPREADSHEET_ID}/clear`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ range })
        }
      );
      const data = await response.json();
      if (data.success) {
        return data;
      }
      throw new Error(data.error);
    } catch (error) {
      console.error('Error clearing row:', error);
      throw error;
    }
  }
}

export default SheetsAPI;
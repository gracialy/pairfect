const API_BASE_URL = 'https://pairfect.codebloop.my.id/api/v1';

export const apiService = {
  async signup(email, password, displayName) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        display_name: displayName,
      }),
    });
    
    if (!response.ok) {
        // Parse the error response
        const error = await response.json(); 
        // Use the backend error message if available
        throw new Error(error.detail || 'Signup failed');
    }      
    
    return response.json();
  },

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    
    if (!response.ok) {
        // Parse the error response
        const error = await response.json(); 
        // Use the backend error message if available
        throw new Error(error.detail || 'Login failed');
    }
    
    return response.json();
  },

  async logout(token) {
    const response = await fetch(`${API_BASE_URL}/session`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
        // Parse the error response
        const error = await response.json(); 
        // Use the backend error message if available
        throw new Error(error.detail || 'Logout failed');
    }
    
    return response.json();
  },

  async pairImages(image, keyword, token) {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('keyword', keyword);
    formData.append('include_faces', 'false');

    const response = await fetch(`${API_BASE_URL}/images/pair`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    });
    
    if (!response.ok) {
        // Parse the error response
        const error = await response.json(); 
        // Use the backend error message if available
        throw new Error(error.detail || 'Image pairing failed');
    }
    
    return response.json();
  },

  async encryptImage(image, sensitivity, token) {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('sensitivity', sensitivity);

    const response = await fetch(`${API_BASE_URL}/images/encrypt`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
        // Parse the error response
        const error = await response.json(); 
        // Use the backend error message if available
        throw new Error(error.detail || 'Image encryption failed');
    }

    return response.json();
  },

  async decryptImage(keyId, cipherText, iv, token) {
    const response = await fetch(`${API_BASE_URL}/images/decrypt`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key_id: keyId,
        cipher_text: cipherText,
        iv: iv
      }),
    });

    if (!response.ok) {
        // Parse the error response
        const error = await response.json(); 
        // Use the backend error message if available
        throw new Error(error.detail || 'Image decryption failed');
    }

    return response.blob(); // Return as blob since it's binary image data
  },

  async generateApiKey(clientId, token) {
    const response = await fetch(`${API_BASE_URL}/developers/key-generation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId
      }),
    });

    if (!response.ok) {
        // Parse the error response
        const error = await response.json(); 
        // Use the backend error message if available
        throw new Error(error.detail || 'API key generation failed');
    }

    return response.json();
  },
};

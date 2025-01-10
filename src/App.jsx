import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { apiService } from './services/api';

// Auth Context with default values
const AuthContext = React.createContext({
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {}
});

// Custom hook for using auth context
const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check for stored token in localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      const { id_token } = response;
      setToken(id_token);
      localStorage.setItem('token', id_token);
      
      // Set basic user info
      const userInfo = { email };
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email, password, displayName) => {
    try {
      const response = await apiService.signup(email, password, displayName);
      // After signup, automatically log in
      await login(email, password);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await apiService.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Login Component
const Login = ({ onNavigate, isSignup = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await signup(email, password, displayName);
      } else {
        await login(email, password);
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="text-2xl font-bold">
        {isSignup ? 'Sign Up' : 'Login'}
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignup && (
            <Input
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full">
            {isSignup ? 'Sign Up' : 'Login'}
          </Button>
          <Button 
            type="button"
            variant="link" 
            className="w-full"
            onClick={() => onNavigate(isSignup ? 'login' : 'signup')}
          >
            {isSignup ? 'Already have an account? Login' : 'Need an account? Sign up'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// Pair Images Component
const PairImages = () => {
  const [image, setImage] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const handlePair = async () => {
    if (!image || !keyword || !token) {
      setError('Please select an image and enter a keyword');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiService.pairImages(image, keyword, token);
      setResult(result);
    } catch (error) {
      console.error('Pairing error:', error);
      setError('Failed to pair images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <Input
        placeholder="Enter keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Button onClick={handlePair} disabled={loading}>
        {loading ? 'Processing...' : 'Pair Images'}
      </Button>
      
      {error && (
        <div className="text-red-600">{error}</div>
      )}
      
      {result && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Results</h3>
          <div className="grid grid-cols-2 gap-4">
            <img src={result.original_image_uri} alt="Original" className="w-full" />
            <img src={result.result_image_uri} alt="Result" className="w-full" />
          </div>
          <p>Match Percentage: {result.percentage_match}%</p>
          <p>Analysis: Based on {result.original_labels.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

// Encrypt Image Component
const EncryptImage = () => {
  const [image, setImage] = useState(null);
  const [sensitivity, setSensitivity] = useState('medium');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleEncrypt = async () => {
    if (!image || !token) return;
    setLoading(true);
    try {
      const result = await apiService.encryptImage(image, sensitivity, token);
      setResult(result);
    } catch (error) {
      console.error('Encryption error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <select 
        value={sensitivity} 
        onChange={(e) => setSensitivity(e.target.value)}
        className="w-full border rounded p-2"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <Button onClick={handleEncrypt} disabled={loading}>
        {loading ? 'Encrypting...' : 'Encrypt Image'}
      </Button>
      
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>Key ID: {result.key_id}</p>
          <p>Cipher Text: {result.cipher_text}</p>
          <p>IV: {result.iv}</p>
        </div>
      )}
    </div>
  );
};

// Decrypt Image Component
const DecryptImage = () => {
  const [keyId, setKeyId] = useState('');
  const [cipherText, setCipherText] = useState('');
  const [iv, setIv] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleDecrypt = async () => {
    if (!keyId || !cipherText || !iv || !token) return;
    setLoading(true);
    try {
      const blob = await apiService.decryptImage(keyId, cipherText, iv, token);
      setResult(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Decryption error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Key ID"
        value={keyId}
        onChange={(e) => setKeyId(e.target.value)}
      />
      <Input
        placeholder="Cipher Text"
        value={cipherText}
        onChange={(e) => setCipherText(e.target.value)}
      />
      <Input
        placeholder="IV"
        value={iv}
        onChange={(e) => setIv(e.target.value)}
      />
      <Button onClick={handleDecrypt} disabled={loading}>
        {loading ? 'Decrypting...' : 'Decrypt Image'}
      </Button>
      
      {result && (
        <div className="mt-4">
          <img src={result} alt="Decrypted" className="max-w-full" />
        </div>
      )}
    </div>
  );
};

// Image Processor Component
const ImageProcessor = () => {
  const [selectedTab, setSelectedTab] = useState('pair');
  
  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader className="text-2xl font-bold">Image Processing</CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full">
            <TabsTrigger value="pair">Pair Images</TabsTrigger>
            <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pair">
            <PairImages />
          </TabsContent>
          <TabsContent value="encrypt">
            <EncryptImage />
          </TabsContent>
          <TabsContent value="decrypt">
            <DecryptImage />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// History Component
const History = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) return;
      
      try {
        const data = await apiService.getPairingHistory(token);
        setHistory(data);
      } catch (error) {
        console.error('History fetch error:', error);
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader className="text-2xl font-bold">History</CardHeader>
      <CardContent>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        <div className="space-y-6">
          {history.map((item) => (
            <div key={item.id} className="border p-4 rounded shadow">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-2 font-medium">Original Image</p>
                  <img src={item.original_image_uri} alt="Original" className="w-full rounded" />
                </div>
                <div>
                  <p className="mb-2 font-medium">Result Image</p>
                  <img src={item.result_image_uri} alt="Result" className="w-full rounded" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <p><strong>Keyword:</strong> {item.original_keyword}</p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p><strong>Label Match:</strong> {(item.label_match * 100).toFixed(1)}%</p>
                    <p><strong>Color Match:</strong> {(item.color_match * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p><strong>Face Match:</strong> {(item.face_match * 100).toFixed(1)}%</p>
                    <p><strong>Overall Match:</strong> {(item.overall_match * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Developer Page Component
const DeveloperPage = () => {
  const [clientId, setClientId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const generateApiKey = async () => {
    if (!clientId || !token) return;
    setLoading(true);
    try {
      const result = await apiService.generateApiKey(clientId, token);
      setApiKey(result.api_key);
    } catch (error) {
      console.error('API key generation error:', error);
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader className="text-2xl font-bold">Developer Tools</CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
          <Button onClick={generateApiKey} disabled={loading}>
            {loading ? 'Generating...' : 'Generate API Key'}
          </Button>
          
          {apiKey && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <p className="font-mono">{apiKey}</p>
              <p className="text-sm text-red-600 mt-2">
                Store this API key safely - it won't be shown again
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Navigation Component
const Navigation = ({ currentPage, onNavigate }) => {
  const { logout } = useAuth();

  return (
    <nav className="bg-white shadow mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-4 items-center">
            <Button 
              variant="ghost" 
              className="font-bold text-xl"
              onClick={() => onNavigate('process')}
            >
              Image Processor
            </Button>
            <Button 
              variant="ghost"
              className={currentPage === 'process' ? 'text-blue-600' : 'text-gray-600'}
              onClick={() => onNavigate('process')}
            >
              Process
            </Button>
            <Button 
              variant="ghost"
              className={currentPage === 'history' ? 'text-blue-600' : 'text-gray-600'}
              onClick={() => onNavigate('history')}
            >
              History
            </Button>
            <Button 
              variant="ghost"
              className={currentPage === 'developer' ? 'text-blue-600' : 'text-gray-600'}
              onClick={() => onNavigate('developer')}
            >
              Developer
            </Button>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// App Content Component
const AppContent = ({ currentPage, setCurrentPage }) => {
  const { user } = useAuth();

  const renderPage = () => {
    if (!user && !['login', 'signup'].includes(currentPage)) {
      return <Login onNavigate={setCurrentPage} />;
    }

    switch (currentPage) {
      case 'login':
        return <Login onNavigate={setCurrentPage} />;
      case 'signup':
        return <Login onNavigate={setCurrentPage} isSignup />;
      case 'process':
        return <ImageProcessor />;
      case 'history':
        return <History />;
      case 'developer':
        return <DeveloperPage />;
      default:
        return <ImageProcessor />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />}
      <div className="max-w-7xl mx-auto px-4">
        {renderPage()}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  
  return (
    <AuthProvider>
      <AppContent currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </AuthProvider>
  );
};

export default App;
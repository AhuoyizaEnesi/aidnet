import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Filter, Utensils, Home, GraduationCap, Heart, Phone, Clock, User, MapPin } from 'lucide-react';
import './App.css';

const App = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'FOOD',
    type: 'OFFER',
    description: '',
    contact: '',
    hours: '',
    coordinates: null
  });

  const categories = [
    { id: 'ALL', name: 'ALL RESOURCES', icon: Filter },
    { id: 'FOOD', name: 'FOOD BANKS', icon: Utensils },
    { id: 'SHELTER', name: 'SHELTER', icon: Home },
    { id: 'EDUCATION', name: 'TUTORING', icon: GraduationCap },
    { id: 'SUPPORT', name: 'SUPPORT', icon: Heart }
  ];

  const sampleData = [
    {
      id: 1,
      name: 'FOOD BANK OF LUBBOCK',
      category: 'FOOD',
      type: 'OFFER',
      description: 'FREE GROCERIES AND MEALS - NO QUESTIONS ASKED',
      contact: '806.763.3003',
      hours: 'MON-FRI 9AM-5PM',
      coordinates: { lat: 33.5779, lng: -101.8552 },
      status: 'OPEN',
      addedBy: 'COMMUNITY VOLUNTEER'
    },
    {
      id: 2,
      name: 'YOUTH EMERGENCY SHELTER',
      category: 'SHELTER',
      type: 'OFFER',
      description: 'SAFE HOUSING FOR YOUTH IN CRISIS - 24/7 INTAKE',
      contact: '806.747.1212',
      hours: '24/7 AVAILABLE',
      coordinates: { lat: 33.5845, lng: -101.8687 },
      status: 'AVAILABLE',
      addedBy: 'SHELTER STAFF'
    },
    {
      id: 3,
      name: 'FREE MATH TUTORING NEEDED',
      category: 'EDUCATION',
      type: 'NEED',
      description: 'HIGH SCHOOL STUDENTS NEED ALGEBRA HELP - VOLUNTEERS WANTED',
      contact: 'CONTACT VIA PLATFORM',
      hours: 'EVENINGS PREFERRED',
      coordinates: { lat: 33.5695, lng: -101.8795 },
      status: 'URGENT',
      addedBy: 'PARENT ORGANIZER'
    },
    {
      id: 4,
      name: 'WINTER COAT DRIVE',
      category: 'SUPPORT',
      type: 'OFFER',
      description: 'FREE WINTER COATS FOR FAMILIES - ALL SIZES AVAILABLE',
      contact: '806.555.0123',
      hours: 'WEEKENDS 10AM-4PM',
      coordinates: { lat: 33.5912, lng: -101.8421 },
      status: 'ACTIVE',
      addedBy: 'COMMUNITY CHURCH'
    }
  ];

  useEffect(() => {
    const savedResources = localStorage.getItem('aidnet-resources');
    if (savedResources) {
      setResources(JSON.parse(savedResources));
    } else {
      setResources(sampleData);
      localStorage.setItem('aidnet-resources', JSON.stringify(sampleData));
    }
  }, []);

  useEffect(() => {
    if (resources.length > 0) {
      localStorage.setItem('aidnet-resources', JSON.stringify(resources));
    }
  }, [resources]);

  useEffect(() => {
    const initMap = () => {
      if (window.google && window.google.maps && mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { 
            lat: parseFloat(process.env.REACT_APP_MAP_CENTER_LAT) || 33.5779, 
            lng: parseFloat(process.env.REACT_APP_MAP_CENTER_LNG) || -101.8552 
          },
          zoom: parseInt(process.env.REACT_APP_MAP_ZOOM) || 12,
          mapTypeId: 'roadmap',
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry.fill',
              stylers: [{ color: '#f5f5f5' }]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#ffffff' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#e6e6e6' }]
            }
          ]
        });

        map.addListener('click', (event) => {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          
          setFormData(prev => ({
            ...prev,
            coordinates: { lat, lng }
          }));
          setShowAddForm(true);
        });

        mapInstance.current = map;
        setMapLoaded(true);
      }
    };

    if (window.google) {
      initMap();
    } else {
      const checkGoogle = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogle);
          initMap();
        }
      }, 100);
      
      return () => clearInterval(checkGoogle);
    }
  }, []);

  useEffect(() => {
    if (mapLoaded && mapInstance.current) {
      updateMapMarkers();
    }
  }, [resources, activeCategory, mapLoaded]);

  const updateMapMarkers = () => {
    if (!mapInstance.current || !window.google) return;

    clearMarkers();

    const filteredResources = activeCategory === 'ALL' 
      ? resources 
      : resources.filter(resource => resource.category === activeCategory);

    filteredResources.forEach((resource) => {
      const marker = new window.google.maps.Marker({
        position: resource.coordinates,
        map: mapInstance.current,
        title: resource.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: getMarkerColor(resource.category, resource.type),
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 8
        }
      });

      marker.addListener('click', () => {
        setSelectedResource(resource);
      });

      markersRef.current.push(marker);
    });
  };

  const clearMarkers = () => {
    markersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = [];
  };

  const getMarkerColor = (category, type) => {
    if (type === 'NEED') return '#dc2626';
    switch (category) {
      case 'FOOD': return '#16a34a';
      case 'SHELTER': return '#7c3aed';
      case 'EDUCATION': return '#ea580c';
      case 'SUPPORT': return '#db2777';
      default: return '#000000';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN':
      case 'ACTIVE':
      case 'AVAILABLE': return 'bg-green-200 text-green-800';
      case 'URGENT':
      case 'NEEDED': return 'bg-red-200 text-red-800';
      case 'CLOSED': return 'bg-gray-200 text-gray-800';
      default: return 'bg-blue-200 text-blue-800';
    }
  };

  const filteredResources = activeCategory === 'ALL' 
    ? resources 
    : resources.filter(resource => resource.category === activeCategory);

  const handleFormSubmit = () => {
    if (!formData.name || !formData.description || !formData.contact || !formData.coordinates) return;

    const newResource = {
      id: Date.now(),
      ...formData,
      status: formData.type === 'OFFER' ? 'ACTIVE' : 'NEEDED',
      addedBy: 'COMMUNITY USER'
    };

    setResources([...resources, newResource]);
    setFormData({
      name: '',
      category: 'FOOD',
      type: 'OFFER',
      description: '',
      contact: '',
      hours: '',
      coordinates: null
    });
    setShowAddForm(false);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setFormData({
      name: '',
      category: 'FOOD',
      type: 'OFFER',
      description: '',
      contact: '',
      hours: '',
      coordinates: null
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white">
        <div className="max-w-full px-8 py-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-6xl font-black tracking-tight mb-4">AIDNET</h1>
              <div className="w-24 h-2 bg-white mb-6"></div>
              <p className="text-xl font-medium tracking-wide">CONNECTING RESOURCES / BUILDING COMMUNITY</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-white text-black px-8 py-4 font-black text-lg tracking-wide hover:bg-gray-100 transition-colors border-4 border-black"
            >
              + ADD RESOURCE
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 border-b-4 border-black">
        <div className="max-w-full px-8 py-6">
          <div className="flex flex-wrap gap-0">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-8 py-4 font-black text-lg tracking-wide border-r-4 border-black transition-colors flex items-center space-x-2 ${
                    activeCategory === category.id
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-gray-200'
                  } ${index === categories.length - 1 ? 'border-r-0' : ''}`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-full grid grid-cols-1 lg:grid-cols-2">
        <div className="border-r-4 border-black">
          <div className="bg-gray-50 p-8">
            <h2 className="text-2xl font-black mb-6 tracking-wide">INTERACTIVE MAP</h2>
            <div className="bg-white border-4 border-black h-96 lg:h-[500px] relative">
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400 animate-pulse" />
                    <p className="text-xl font-black tracking-wide text-gray-600">LOADING MAP...</p>
                  </div>
                </div>
              )}
              <div ref={mapRef} className="w-full h-full"></div>
            </div>

            <div className="mt-4 bg-black text-white p-4">
              <div className="flex justify-between items-center text-sm font-black tracking-wide">
                <span>ACTIVE RESOURCES: {filteredResources.length}</span>
                <span>CATEGORY: {activeCategory}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white">
          {showAddForm && (
            <div className="bg-gray-100 p-8 border-b-4 border-black">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black tracking-wide">ADD NEW RESOURCE</h2>
                <button 
                  onClick={handleCloseForm}
                  className="p-2 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-black tracking-wide mb-2">RESOURCE NAME</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-4 border-4 border-black focus:outline-none bg-white font-medium"
                    placeholder="FOOD BANK, SHELTER, TUTORING SERVICE..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-black tracking-wide mb-2">CATEGORY</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full p-4 border-4 border-black focus:outline-none bg-white font-medium"
                    >
                      <option value="FOOD">FOOD BANKS</option>
                      <option value="SHELTER">SHELTER</option>
                      <option value="EDUCATION">TUTORING</option>
                      <option value="SUPPORT">SUPPORT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-black tracking-wide mb-2">TYPE</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full p-4 border-4 border-black focus:outline-none bg-white font-medium"
                    >
                      <option value="OFFER">OFFERING HELP</option>
                      <option value="NEED">NEED HELP</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-black tracking-wide mb-2">DESCRIPTION</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-4 border-4 border-black focus:outline-none bg-white font-medium"
                    rows="3"
                    placeholder="DESCRIBE WHAT YOU'RE OFFERING OR NEED..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-black tracking-wide mb-2">CONTACT</label>
                    <input
                      type="text"
                      value={formData.contact}
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      className="w-full p-4 border-4 border-black focus:outline-none bg-white font-medium"
                      placeholder="PHONE OR EMAIL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black tracking-wide mb-2">HOURS</label>
                    <input
                      type="text"
                      value={formData.hours}
                      onChange={(e) => setFormData({...formData, hours: e.target.value})}
                      className="w-full p-4 border-4 border-black focus:outline-none bg-white font-medium"
                      placeholder="MON-FRI 9AM-5PM"
                    />
                  </div>
                </div>
                
                {formData.coordinates && (
                  <div className="bg-blue-50 p-4 border-2 border-blue-200">
                    <p className="text-sm font-black tracking-wide text-blue-800">
                      LOCATION SET: {formData.coordinates.lat.toFixed(4)}, {formData.coordinates.lng.toFixed(4)}
                    </p>
                  </div>
                )}
                
                <button 
                  onClick={handleFormSubmit}
                  disabled={!formData.coordinates}
                  className={`w-full py-4 font-black text-lg tracking-wide transition-colors ${
                    formData.coordinates 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {formData.coordinates ? 'SUBMIT RESOURCE' : 'CLICK MAP TO SET LOCATION'}
                </button>
              </div>
            </div>
          )}

          {selectedResource && (
            <div className="bg-blue-50 p-8 border-b-4 border-black">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-black tracking-wide">{selectedResource.name}</h2>
                <button 
                  onClick={() => setSelectedResource(null)}
                  className="p-2 hover:bg-blue-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <p className="font-medium text-gray-700 text-lg">{selectedResource.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span className="font-medium">{selectedResource.contact}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{selectedResource.hours}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{selectedResource.addedBy}</span>
                  </div>
                  <div>
                    <span className={`px-3 py-1 text-xs font-black tracking-wide ${getStatusColor(selectedResource.status)}`}>
                      {selectedResource.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-8">
            <h2 className="text-2xl font-black mb-6 tracking-wide">
              {activeCategory === 'ALL' ? 'ALL RESOURCES' : categories.find(c => c.id === activeCategory)?.name}
            </h2>
            <div className="space-y-0">
              {filteredResources.map((resource, index) => (
                <div
                  key={resource.id}
                  className={`p-6 border-b-4 border-black bg-white hover:bg-gray-50 transition-colors cursor-pointer ${
                    index === filteredResources.length - 1 ? 'border-b-0' : ''
                  }`}
                  onClick={() => setSelectedResource(resource)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-black tracking-wide">{resource.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 text-xs font-black tracking-wide ${getStatusColor(resource.status)}`}>
                        {resource.status}
                      </span>
                      <span className={`px-3 py-1 text-xs font-black tracking-wide ${
                        resource.type === 'OFFER' ? 'bg-black text-white' : 'bg-red-600 text-white'
                      }`}>
                        {resource.type}
                      </span>
                    </div>
                  </div>
                  <p className="font-medium text-gray-700 mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{resource.contact}</span>
                    <span className="text-gray-500">{resource.hours}</span>
                  </div>
                </div>
              ))}
              
              {filteredResources.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-xl font-black tracking-wide text-gray-500">NO RESOURCES FOUND</p>
                  <p className="font-medium text-gray-400 mt-2">BE THE FIRST TO ADD ONE</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
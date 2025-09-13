# AIDNET — Community Resource Mapping

**Tagline:** Connecting resources, building community.

AIDNET is a lightweight web application that helps communities **discover, share, and track** local resources including food banks, shelters, tutoring services, and community support. Simply click on the map to add a pin, fill out a quick form, and your resource appears on the map and in the list instantly.

> Built for the **Zero Boundaries Hackathon** (Social Good category).

---

## 🎥 Demo

- **Video Demo:** [Add your video link here]
- **Live Demo:** [Add your deployed link here]

![AIDNET Screenshot](./public/screenshot.png)

---

## ✨ Features

- **Interactive Google Map** with category filters (Food, Shelter, Tutoring, Support)
- **One-click resource addition**: Click anywhere on the map to capture coordinates, fill a simple form, and submit
- **Immediate visibility**: Newly added resources appear at the top of the list with automatic filtering and smooth scrolling
- **Category filtering**: Filter resources by type to find exactly what you need
- **Persistent data**: All resources are saved locally for seamless demo experience
- **Responsive design**: Works great on desktop and mobile devices
- **Clean, intuitive UI** built with modern React components and Lucide icons

---

## 🧱 Tech Stack

- **Frontend:** React (Create React App)
- **Mapping:** Google Maps JavaScript API
- **State Management:** React Hooks + Context
- **Data Persistence:** LocalStorage for demo purposes
- **Icons:** Lucide React
- **Styling:** CSS3 with modern flexbox/grid layouts

---

## 🗂️ Project Structure

```
aidnet/
├── public/
│   ├── index.html           # Entry point with Google Maps script
│   └── screenshot.png       # App screenshot for README
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapContainer.jsx
│   │   │   └── ResourceMarker.jsx
│   │   ├── ResourceForm/
│   │   │   └── AddResourceForm.jsx
│   │   ├── ResourceList/
│   │   │   ├── ResourceList.jsx
│   │   │   └── ResourceCard.jsx
│   │   └── Chat/
│   │       └── ChatWidget.jsx    # Optional AidBot helper
│   ├── services/
│   │   └── localStorage.js       # Data persistence utilities
│   ├── utils/
│   │   └── constants.js          # App constants and configurations
│   ├── App.js                    # Main application component
│   ├── App.css                   # Global styles
│   └── index.js                  # React entry point
├── .env.example                  # Environment variables template
├── .gitignore
├── package.json
├── LICENSE
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites

- **Node.js** version 18 or higher
- **npm** or **yarn** package manager
- **Google Maps JavaScript API key** (with Maps JavaScript API enabled)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/aidnet.git
   cd aidnet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```env
   REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
   REACT_APP_MAP_CENTER_LAT=33.5779
   REACT_APP_MAP_CENTER_LNG=-101.8552
   REACT_APP_MAP_ZOOM=12
   ```

4. **Update Google Maps script**
   
   Replace the placeholder in `public/index.html`:
   ```html
   <script async defer
     src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=places,geometry">
   </script>
   ```

5. **Start the development server**
   ```bash
   npm start
   ```
   
   Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🚀 Usage

### Adding Resources

1. **Click anywhere on the map** where you want to add a resource
2. **Fill out the form** with resource details:
   - Resource name
   - Category (Food, Shelter, Tutoring, Support)
   - Description
   - Contact information
3. **Submit** to see your resource appear immediately on the map and in the list

### Finding Resources

1. **Use category filters** to narrow down resource types
2. **Click on map markers** to view resource details
3. **Browse the resource list** for detailed information
4. **Use the search functionality** to find specific resources

---

## 🛠️ Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📱 Deployment

### Build for Production

```bash
npm run build
```

The build folder will contain the optimized production files.

### Deploy to Netlify/Vercel

1. Connect your GitHub repository
2. Set environment variables in your hosting platform
3. Deploy with automatic builds on push

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key | `AIza...` |
| `REACT_APP_MAP_CENTER_LAT` | Default map center latitude | `33.5779` |
| `REACT_APP_MAP_CENTER_LNG` | Default map center longitude | `-101.8552` |
| `REACT_APP_MAP_ZOOM` | Default map zoom level | `12` |

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Follow the installation instructions above
2. Create a new branch for your feature
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---


---

## 🗺️ Future Roadmap

- [ ] User authentication and profiles
- [ ] Resource verification system
- [ ] Mobile app development
- [ ] Integration with existing community services
- [ ] Advanced search and filtering
- [ ] Multi-language support
- [ ] Accessibility improvements

---

*Built with ❤️ for community impact*
# VizualNetwork - Futuristic Web Proxy

A cyberpunk-styled web proxy application with advanced features and a futuristic interface.

## 🌟 Features

- **Multiple Proxy Engines**: Rammerhead, Scramjet, and Wisp support
- **Cyberpunk UI**: Neon-styled interface with grid backgrounds
- **PWA Support**: Progressive Web App with offline functionality
- **Tab Cloaking**: Advanced privacy features
- **Mobile Responsive**: Works on all devices
- **Quick Links**: Fast access to popular sites

## 🚀 Live Demo

Visit the live application at: https://educationalisticz.web.app

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with cyberpunk theme
- **PWA**: Service Worker, Web App Manifest
- **Hosting**: Firebase Hosting
- **Proxy Engines**: Rammerhead, Scramjet, Wisp

## 📁 Project Structure

```
├── assets/           # Images and icons
├── js/              # JavaScript files
│   ├── components/  # Proxy engine components
│   └── utils/       # Utility functions
├── styles/          # CSS stylesheets
├── index.html       # Main HTML file
├── manifest.json    # PWA manifest
├── sw.js           # Service worker
└── firebase.json   # Firebase configuration
```

## 🔧 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/vizualnetwork.git
   cd vizualnetwork
   ```

2. **Open in browser**:
   - Use a local server (Live Server, Python's http.server, etc.)
   - Or simply open `index.html` in your browser

3. **Deploy to Firebase** (optional):
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy
   ```

## 🎨 Customization

- **Themes**: Modify `styles/cyberpunk.css` for different color schemes
- **Proxy Engines**: Add new engines in `js/components/ProxyEngine.js`
- **UI Components**: Update the VizualNetwork class in `js/main.js`

## 📱 PWA Features

- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Service worker caches resources
- **App-like Experience**: Standalone display mode

## 🔒 Privacy & Security

- **No Data Collection**: No user data is stored
- **Client-side Processing**: All operations happen in the browser
- **Secure Proxies**: Uses trusted proxy services

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**VizualNetwork** - Access the web through our futuristic proxy network 🚀

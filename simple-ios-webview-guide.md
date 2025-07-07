# Simple iOS WebView App for HODLearn - Step by Step

## Create a New iOS Project in Xcode

1. **Open Xcode** (ignore the blank workspace issue)
2. **Create New Project**:
   - Choose "Create a new Xcode project"
   - Select "iOS" → "App"
   - Click "Next"

3. **Project Settings**:
   - Product Name: `HODLearn`
   - Bundle Identifier: `com.hodlearn.app`
   - Language: Swift
   - Interface: Storyboard
   - Click "Next" → "Create"

## Add WebView Code

4. **Open ViewController.swift** (in the project navigator)

5. **Replace the entire file content** with this code:

```swift
import UIKit
import WebKit

class ViewController: UIViewController, WKNavigationDelegate {
    
    var webView: WKWebView!
    
    override func loadView() {
        webView = WKWebView()
        webView.navigationDelegate = self
        view = webView
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Replace with your actual Replit URL
        let url = URL(string: "https://your-replit-url.replit.app")!
        webView.load(URLRequest(url: url))
        
        // Allow back/forward gestures
        webView.allowsBackForwardNavigationGestures = true
    }
    
    // Handle page loading
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("Page loaded successfully")
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("Failed to load page: \(error.localizedDescription)")
    }
}
```

6. **Update the URL**: Replace `"https://your-replit-url.replit.app"` with your actual Replit app URL

7. **Build and Run**: Click the play button (▶️) in Xcode

This creates a simple iOS app that loads your HODLearn web app directly. You'll have:
- Full HODLearn functionality
- Native iOS app wrapper
- Ability to test on simulator or device
- Ready for TestFlight if needed

Much simpler than the Capacitor approach and gets you testing immediately!

Would you like me to help you find your Replit URL for the code?
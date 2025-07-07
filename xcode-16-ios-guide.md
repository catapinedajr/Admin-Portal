# HODLearn iOS App - Xcode 16.4 Guide

## Step 1: Create New Project in Xcode 16.4

1. **Open Xcode 16.4**
2. **Create Project**:
   - Click "Create a new Xcode project" (or File → New → Project)
   - Select **iOS** tab at the top
   - Choose **App** template
   - Click **Next**

3. **Project Configuration**:
   - **Product Name**: `HODLearn`
   - **Team**: Select your Apple ID/Developer account
   - **Organization Identifier**: `com.hodlearn.app`
   - **Bundle Identifier**: Should auto-fill as `com.hodlearn.app.HODLearn`
   - **Language**: **Swift**
   - **Interface**: **Storyboard** (not SwiftUI)
   - **Use Core Data**: Leave unchecked
   - Click **Next**

4. **Save Location**: Choose where to save the project and click **Create**

## Step 2: Modify ViewController for WebView

1. **In the Navigator (left panel)**: Click on **ViewController.swift**
2. **Replace ALL the code** with this:

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
        
        // Your HODLearn app URL
        let url = URL(string: "https://your-replit-url.replit.app")!
        webView.load(URLRequest(url: url))
        webView.allowsBackForwardNavigationGestures = true
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("HODLearn loaded successfully")
    }
}
```

3. **Update the URL**: Replace `your-replit-url.replit.app` with your actual Replit URL

## Step 3: Build and Run

1. **Select Simulator**: In the top toolbar, click the device dropdown and choose "iPhone 15" or any simulator
2. **Build**: Click the **Play button (▶️)** or press **Cmd+R**
3. **Wait**: First build takes 2-3 minutes
4. **Test**: The simulator will open with your HODLearn app

## Your Replit URL
Your URL should be visible in your browser when viewing the Replit app. It looks like:
`https://[project-name].[username].replit.app`
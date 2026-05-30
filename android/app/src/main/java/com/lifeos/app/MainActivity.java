package com.lifeos.app;

import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    
    private WebView webView;
    
    // CHANGE THIS TO YOUR WEBSITE URL
    private static final String WEBSITE_URL = "https://yoursite.netlify.app";
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        webView = new WebView(this);
        setContentView(webView);
        
        // Enable JavaScript
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setAllowFileAccess(true);
        
        // Load website
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl(WEBSITE_URL);
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
package com.lifeos.app;

import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.os.Bundle;
import android.app.Activity;

public class MainActivity extends Activity {
    
    private WebView webView;
    
    private static final String WEBSITE_URL = "https://lifetrackr-premium.netlify.app";
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        webView = new WebView(this);
        setContentView(webView);
        
        // Enable JavaScript and storage APIs
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setDatabaseEnabled(true);
        webView.getSettings().setAllowFileAccess(true);
        
        // Support mixed content on Lollipop and above
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            webView.getSettings().setMixedContentMode(android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
        
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
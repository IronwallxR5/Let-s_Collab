import React, { useState, useEffect } from 'react';
import { Server, X, Info } from 'lucide-react';

const ColdStartPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check local storage after component mounts
    const hasSeenPopup = localStorage.getItem('hasSeenColdStartPopup');
    if (!hasSeenPopup) {
      // Small delay to let the page load first
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenColdStartPopup', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-1">
          <div className="flex items-start justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2 text-primary">
              <Info className="w-5 h-5" />
              <h3 className="font-semibold text-lg text-foreground">Server Wake Up</h3>
            </div>
            <button 
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground hover:bg-accent p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-muted rounded-full border border-border">
                <Server className="w-10 h-10 text-secondary" />
              </div>
            </div>
            
            <p className="text-muted-foreground text-center mb-6 leading-relaxed">
              Welcome! Since our backend is hosted on a free Render tier, it may take <strong className="text-foreground bg-accent px-2 py-0.5 rounded">1-2 minutes</strong> to wake up from a cold start on your first action.
              <br/><br/>
              Thank you for your patience!
            </p>
            
            <button
              onClick={handleClose}
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors shadow-lg shadow-primary/20"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColdStartPopup;

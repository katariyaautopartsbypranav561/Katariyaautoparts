import React, { useEffect, useRef } from 'react';

export default function InstagramEmbed({ url }) {
  const containerRef = useRef(null);

  // Extract clean URL whether they pasted a link or full embed code
  const getCleanUrl = (inputUrl) => {
    try {
      // If it's a full embed code, extract the link
      const match = inputUrl.match(/data-instgrm-permalink="(.*?)"/);
      let cleanUrl = match ? match[1] : inputUrl;
      cleanUrl = cleanUrl.split('?')[0];
      if (!cleanUrl.endsWith('/')) cleanUrl += '/';
      return cleanUrl;
    } catch(e) {
      return inputUrl;
    }
  };

  const cleanUrl = getCleanUrl(url);

  useEffect(() => {
    // Inject the Instagram script if it doesn't exist
    if (!window.instgrm) {
      const script = document.createElement('script');
      script.src = '//www.instagram.com/embed.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        }
      };
    } else {
      window.instgrm.Embeds.process();
    }
  }, [cleanUrl]);

  return (
    <div ref={containerRef} className="instagram-embed-container w-full bg-white flex justify-center">
      <blockquote 
        className="instagram-media" 
        data-instgrm-captioned 
        data-instgrm-permalink={cleanUrl} 
        data-instgrm-version="14" 
        style={{
          background: '#FFF',
          border: 0,
          borderRadius: '3px',
          boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
          margin: '1px',
          maxWidth: '540px',
          minWidth: '326px',
          padding: 0,
          width: 'calc(100% - 2px)'
        }}
      >
        <div style={{ padding: '16px' }}>
          <a href={cleanUrl} style={{ background: '#FFFFFF', lineHeight: 0, padding: '0 0', textAlign: 'center', textDecoration: 'none', width: '100%' }} target="_blank" rel="noreferrer">
             View this post on Instagram
          </a>
        </div>
      </blockquote>
    </div>
  );
}

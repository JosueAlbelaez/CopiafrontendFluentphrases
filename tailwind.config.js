
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#87CEEB',    // azul claro
        secondary: '#006400',  // verde oscuro
        tertiary: '#808080',   // gris
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            h2: {
              color: '#111827',
              fontWeight: '700',           
              fontSize: '1.5em',           // 24px
              marginTop: '1.2em',          
              marginBottom: '0.6em',       
              letterSpacing: '-0.02em',    
            },
            h3: {
              color: '#111827',
              fontWeight: '600',           
              fontSize: '1.25em',          // 20px
              marginTop: '1em',            
              marginBottom: '0.5em',       
              letterSpacing: '-0.01em',    
            },
            h4: {
              color: '#111827',
              fontWeight: '600',           
              fontSize: '1.125em',         // 18px
              marginTop: '0.8em',          
              marginBottom: '0.4em',       
              letterSpacing: '0',    
            },
            p: {
              marginTop: '1.5em',          
              marginBottom: '1.5em',       
              lineHeight: '1.8',           
              fontSize: '1.125rem',        
              color: '#4B5563',           
            },
            'ul > li': {
              paddingLeft: '1.5em',
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            'ol > li': {
              paddingLeft: '1.5em',
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            a: {
              color: '#2563eb',
              '&:hover': {
                color: '#1d4ed8',
              },
            },
            blockquote: {
              borderLeftColor: '#2563eb',
              backgroundColor: '#f3f4f6',
              padding: '1.5em',            
              fontStyle: 'italic',
              fontSize: '1.1em',           
              marginTop: '2em',            
              marginBottom: '2em',         
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

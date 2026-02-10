tailwind.config = {
    theme: {
        extend: {
            colors: {
                'antigravity': {
                    bg: '#0a0a0a',
                    violet: '#8b5cf6', // A500 range, tweak for neon
                    cyan: '#06b6d4',   // Cyan range
                    dark: '#111111',
                    panel: '#1a1a1a'
                }
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
            },
            boxShadow: {
                'neon-violet': '0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)',
                'neon-cyan': '0 0 10px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.3)',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                }
            }
        }
    }
}

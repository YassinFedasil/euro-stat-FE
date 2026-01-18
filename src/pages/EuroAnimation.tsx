import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

interface EuroBill {
    id: number;
    denomination: 5 | 10 | 20 | 50 | 100 | 200 | 500;
    left: number;
    rotation: number;
    speed: number;
    scale: number;
}

const EuroAnimation: React.FC = () => {
    const [bills, setBills] = useState<EuroBill[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Génère un billet aléatoire
    const generateBill = (): EuroBill => {
        const containerWidth = containerRef.current?.clientWidth || window.innerWidth;

        return {
            id: Date.now() + Math.random(),
            denomination: [5, 10, 20, 50, 100, 200, 500][Math.floor(Math.random() * 7)] as any,
            left: Math.random() * (containerWidth - 120),
            rotation: Math.random() * 360,
            speed: 10 + Math.random() * 20,
            scale: 0.5 + Math.random() * 0.5
        };
    };

    // URLs des images de billets
    const billImages = {
        5: "https://images.freeimages.com/vhq/images/previews/100/50-euro-note-109293.png?fmt=webp&h=350",
        10: "https://as1.ftcdn.net/jpg/01/60/48/48/1000_F_160484803_HvQMJjxSSlawbcCrZjgTnB9MvUCe22s9.jpg",
        20: "https://as2.ftcdn.net/v2/jpg/01/60/48/47/1000_F_160484799_eiLxC8RGNcFdaxOiZpMPZcFlIVcZMXwr.jpg",
        50: "https://t3.ftcdn.net/jpg/16/41/26/64/240_F_1641266459_mO5eVX7aCZx1BPa8dvG46zdPzJ9AgPRJ.jpg",
        100: "https://as1.ftcdn.net/jpg/01/68/40/12/1000_F_168401282_YFqDXHPwjUetzodT7qy7RfJQz6jFsqPG.jpg",
        200: "https://as2.ftcdn.net/jpg/01/60/48/47/1000_F_160484776_VS3GodLndDFdet6h0XpDRkSyh9cxKHbg.jpg",
        500: "https://as2.ftcdn.net/jpg/01/60/48/47/1000_F_160484780_oHwD6fn7to5fY5Svetgo4c5TaEDgmgvR.jpg",
    };

    // Ajoute un billet toutes les secondes
    useEffect(() => {
        const interval = setInterval(() => {
            setBills(prev => [...prev.slice(-20), generateBill()]);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Container ref={containerRef}>
            {bills.map((bill, index) => (
                <Bill
                    key={bill.id}
                    style={{
                        left: `${bill.left}px`,
                        animationDuration: `${bill.speed}s`,
                        transform: `rotate(${bill.rotation}deg) scale(${bill.scale})`,
                        zIndex: bills.length - index
                    }}
                >
                    <img
                        src={billImages[bill.denomination]}
                        alt={`Billet ${bill.denomination}€`}
                    />
                </Bill>
            ))}
        </Container>
    );
};

// Animation de chute
const fall = keyframes`
  0% {
    top: -100px;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    top: 100vh;
    opacity: 0;
  }
`;

// Styles
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  //background: linear-gradient(to bottom, #87CEEB, #E0F7FF);
`;

const Bill = styled.div`
  position: absolute;
  width: 120px;
  height: 60px;
  animation: ${fall} linear forwards;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(20px 4px 6px rgba(0,0,0,0.3));
  }
`;

export default EuroAnimation;
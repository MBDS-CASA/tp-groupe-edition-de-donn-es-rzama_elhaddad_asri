import { useState } from "react";
import data from "./data.json";

const getRandomItem = (items) => {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
};

const RandomItemDisplay = () => {
    const [randomItem, setRandomItem] = useState(getRandomItem(data));

    const handleGenerateNewItem = () => {
        setRandomItem(getRandomItem(data));
    };

    return (
        <div className="container" style={{ padding: "20px", textAlign: "center" }}>
            <h1 style={{ marginBottom: "20px" }}>Détail de l'élément</h1>
            <div className="item-card" style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
                <p><strong>ID Unique:</strong> {randomItem.unique_id}</p>
                <p><strong>Cours:</strong> {randomItem.course}</p>
                <p><strong>Prénom:</strong> {randomItem.student.firstname}</p>
                <p><strong>Nom:</strong> {randomItem.student.lastname}</p>
                <p><strong>ID Étudiant:</strong> {randomItem.student.id}</p>
                <p><strong>Date:</strong> {randomItem.date}</p>
                <p><strong>Note:</strong> {randomItem.grade}</p>
            </div>
            <button
                onClick={handleGenerateNewItem}
                style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
            >
                Afficher un autre élément
            </button>
        </div>
    );
};

export default RandomItemDisplay;

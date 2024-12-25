import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Typography,
    Button,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import data from '../data.json';

function Matieres() {
    const [search, setSearch] = useState('');
    const [matieres, setMatieres] = useState(
        data.map((item) => ({ id: Date.now() + Math.random(), name: item.course }))
    );
    const [editingId, setEditingId] = useState(null);
    const [editedMatiere, setEditedMatiere] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newMatiere, setNewMatiere] = useState('');

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleEditClick = (id) => {
        setEditingId(id);
        const matiere = matieres.find((matiere) => matiere.id === id);
        setEditedMatiere(matiere.name);
    };

    const handleEditChange = (e) => {
        setEditedMatiere(e.target.value);
    };

    const handleEditSave = () => {
        setMatieres((prev) =>
            prev.map((matiere) =>
                matiere.id === editingId ? { ...matiere, name: editedMatiere } : matiere
            )
        );
        setEditingId(null);
        setEditedMatiere('');
    };

    const handleDeleteClick = (id) => {
        setMatieres((prev) => prev.filter((matiere) => matiere.id !== id));
    };

    const handleAddChange = (e) => {
        setNewMatiere(e.target.value);
    };

    const handleAddMatiere = () => {
        if (newMatiere.trim() !== '' && !matieres.some((m) => m.name === newMatiere.trim())) {
            setMatieres((prev) => [
                ...prev,
                { id: Date.now() + Math.random(), name: newMatiere.trim() },
            ]);
        }
        setNewMatiere('');
        setIsAddDialogOpen(false);
    };

    const filteredMatieres = matieres.filter((matiere) =>
        matiere.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDownloadCSV = () => {
        const csvContent = [
            ['ID', 'Matière'],
            ...matieres.map((matiere) => [matiere.id, matiere.name]),
        ]
            .map((row) => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'matieres.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            {/* Titre des matières */}
            <Typography variant="h4" style={{ color: 'white', marginBottom: '20px' }}>
                Matières
            </Typography>

            {/* Barre de recherche */}
            <TextField
                label="Rechercher par matière"
                variant="outlined"
                fullWidth
                onChange={handleSearchChange}
                value={search}
                style={{ marginBottom: '20px' }}
                inputProps={{ style: { color: 'white' } }}
            />

            {/* Boutons pour ajouter et télécharger */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    Ajouter une matière
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleDownloadCSV}
                >
                    Télécharger CSV
                </Button>
            </div>

            {/* Table des matières */}
            <TableContainer component={Paper} style={{ backgroundColor: '#333' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ color: 'white' }}>Matière</TableCell>
                            <TableCell style={{ color: 'white' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredMatieres.map((matiere) => (
                            <TableRow key={matiere.id}>
                                {editingId === matiere.id ? (
                                    <>
                                        <TableCell style={{ color: 'white' }}>
                                            <TextField
                                                value={editedMatiere}
                                                onChange={handleEditChange}
                                                variant="standard"
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button color="primary" onClick={handleEditSave}>
                                                Sauvegarder
                                            </Button>
                                            <Button
                                                color="secondary"
                                                onClick={() => setEditingId(null)}
                                            >
                                                Annuler
                                            </Button>
                                        </TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell style={{ color: 'white' }}>{matiere.name}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEditClick(matiere.id)}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                color="secondary"
                                                onClick={() => handleDeleteClick(matiere.id)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog pour ajouter une matière */}
            <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
                <DialogTitle>Ajouter une matière</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Matière"
                        value={newMatiere}
                        onChange={handleAddChange}
                        fullWidth
                        style={{ marginBottom: '10px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddMatiere} color="primary">
                        Ajouter
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)} color="secondary">
                        Annuler
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Matieres;

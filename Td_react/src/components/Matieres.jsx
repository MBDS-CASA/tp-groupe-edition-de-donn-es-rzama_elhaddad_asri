import { useState, useEffect } from 'react';
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
import axios from 'axios';

function Matieres() {
    const [search, setSearch] = useState('');
    const [matieres, setMatieres] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedMatiere, setEditedMatiere] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newMatiere, setNewMatiere] = useState('');

    useEffect(() => {
        // Fetch courses from the API
        axios.get('http://localhost:8010/api/courses')
            .then((response) => {
                setMatieres(response.data);
            })
            .catch((error) => {
                console.error("There was an error fetching the courses!", error);
            });
    }, []);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleEditClick = (id) => {
        setEditingId(id);
        const matiere = matieres.find((matiere) => matiere._id === id);
        setEditedMatiere(matiere?.course || ''); // Safeguard against undefined
    };

    const handleEditChange = (e) => {
        setEditedMatiere(e.target.value);
    };

    const handleEditSave = () => {
        // Update course via API
        const updatedCourse = { course: editedMatiere, code: editedMatiere.replace(" ", "").toUpperCase().slice(0, 6) };
        axios.put(`http://localhost:8010/api/courses/${editingId}`, updatedCourse)
            .then(() => {
                setMatieres((prev) =>
                    prev.map((matiere) =>
                        matiere._id === editingId ? { ...matiere, course: editedMatiere } : matiere
                    )
                );
                setEditingId(null);
                setEditedMatiere('');
            })
            .catch((error) => {
                console.error("There was an error updating the course!", error);
            });
    };

    const handleDeleteClick = (id) => {
        axios.delete(`http://localhost:8010/api/courses/${id}`)
            .then(() => {
                setMatieres((prev) => prev.filter((matiere) => matiere._id !== id));
            })
            .catch((error) => {
                console.error("There was an error deleting the course!", error);
            });
    };

    const handleAddChange = (e) => {
        setNewMatiere(e.target.value);
    };

    const handleAddMatiere = () => {
        if (newMatiere.trim() !== '') {
            const newCourse = { course: newMatiere.trim(), code: newMatiere.trim().replace(" ", "").toUpperCase().slice(0, 6) };
            axios.post('http://localhost:8010/api/courses', newCourse)
                .then(() => {
                    setMatieres((prev) => [
                        ...prev,
                        { _id: Date.now(), course: newMatiere.trim() },
                    ]);
                    setNewMatiere('');
                    setIsAddDialogOpen(false);
                })
                .catch((error) => {
                    console.error("There was an error adding the course!", error);
                });
        }
    };

    const filteredMatieres = matieres.filter((matiere) =>
        matiere?.course?.toLowerCase().includes(search.toLowerCase())
    );

    const handleDownloadCSV = () => {
        const csvContent = [
            ['ID', 'Matière'],
            ...matieres.map((matiere) => [matiere._id, matiere.course]),
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
                            <TableRow key={matiere._id}>
                                {editingId === matiere._id ? (
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
                                        <TableCell style={{ color: 'white' }}>{matiere?.course}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEditClick(matiere._id)}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                color="secondary"
                                                onClick={() => handleDeleteClick(matiere._id)}
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

import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import axios from 'axios';

function Notes() {
    const [search, setSearch] = useState('');
    const [notesData, setNotesData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);

    // Récupérer les données au chargement du composant
    useEffect(() => {
        axios.get('http://localhost:8010/api/grades')
            .then((response) => {
                setNotesData(response.data);
            })
            .catch((error) => {
                console.error("Il y a eu un problème avec la récupération des données : ", error);
            });
    }, []);

    const handleSearchChange = (e) => setSearch(e.target.value);

    const filteredData = notesData.filter((item) => {
        const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
        const searchTerm = search.toLowerCase();
        return fullName.includes(searchTerm);
    });

    const handleOpenDialog = (note = null) => {
        setCurrentNote(note);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentNote(null);
    };

    const handleSaveNote = () => {
        if (currentNote._id) {
            // Mettre à jour une note existante
            axios.put(`http://localhost:8010/api/grades/${currentNote._id}`, currentNote)
                .then(() => {
                    setNotesData((prevData) =>
                        prevData.map((note) =>
                            note._id === currentNote._id ? currentNote : note
                        )
                    );
                    handleCloseDialog();
                })
                .catch((error) => {
                    console.error("Erreur lors de la mise à jour de la note : ", error);
                });
        } else {
            // Ajouter une nouvelle note
            axios.post('http://localhost:8010/api/grades', currentNote)
                .then((response) => {
                    setNotesData((prevData) => [
                        ...prevData,
                        response.data,
                    ]);
                    handleCloseDialog();
                })
                .catch((error) => {
                    console.error("Erreur lors de l'ajout de la note : ", error);
                });
        }
    };

    const handleDeleteNote = (id) => {
        axios.delete(`http://localhost:8010/api/grades/${id}`)
            .then(() => {
                setNotesData((prevData) => prevData.filter((note) => note._id !== id));
            })
            .catch((error) => {
                console.error("Erreur lors de la suppression de la note : ", error);
            });
    };

    const handleDownloadCSV = () => {
        const csvRows = [
            ['ID', 'Cours', 'Prénom', 'Nom', 'Date', 'Note'],
            ...notesData.map((note) => [
                note._id,
                note.course,
                note.firstName,
                note.lastName,
                note.date,
                note.grade,
            ]),
        ];
        const csvContent = csvRows.map((row) => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'notes.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <TextField
                label="Rechercher par nom, prénom ou cours"
                variant="outlined"
                fullWidth
                onChange={handleSearchChange}
                value={search}
                style={{ marginBottom: '20px' }}
                inputProps={{ style: { color: 'white' } }}
            />
            <TableContainer component={Paper} style={{ backgroundColor: '#333' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ color: 'white' }}>ID</TableCell>
                            <TableCell style={{ color: 'white' }}>Cours</TableCell>
                            <TableCell style={{ color: 'white' }}>Étudiant</TableCell>
                            <TableCell style={{ color: 'white' }}>Date</TableCell>
                            <TableCell style={{ color: 'white' }}>Note</TableCell>
                            <TableCell style={{ color: 'white' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell style={{ color: 'white' }}>{item._id}</TableCell>
                                <TableCell style={{ color: 'white' }}>{item.course}</TableCell>
                                <TableCell style={{ color: 'white' }}>
                                    {`${item.firstName} ${item.lastName}`}
                                </TableCell>
                                <TableCell style={{ color: 'white' }}>{item.date}</TableCell>
                                <TableCell style={{ color: 'white' }}>{item.grade}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenDialog(item)}
                                    >
                                        Modifier
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDeleteNote(item._id)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Supprimer
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ marginTop: '20px' }}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleOpenDialog()}
                >
                    Ajouter une note
                </Button>
                <Button
                    variant="contained"
                    color="info"
                    onClick={handleDownloadCSV}
                    style={{ marginLeft: '10px' }}
                >
                    Télécharger CSV
                </Button>
            </div>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {currentNote?._id ? 'Modifier' : 'Ajouter'} une note
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Cours"
                        fullWidth
                        value={currentNote?.course || ''}
                        onChange={(e) =>
                            setCurrentNote({ ...currentNote, course: e.target.value })
                        }
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Prénom de l'étudiant"
                        fullWidth
                        value={currentNote?.firstName || ''}
                        onChange={(e) =>
                            setCurrentNote({
                                ...currentNote,
                                firstName: e.target.value,
                            })
                        }
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Nom de l'étudiant"
                        fullWidth
                        value={currentNote?.lastName || ''}
                        onChange={(e) =>
                            setCurrentNote({
                                ...currentNote,
                                lastName: e.target.value,
                            })
                        }
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Date"
                        fullWidth
                        value={currentNote?.date || ''}
                        onChange={(e) =>
                            setCurrentNote({ ...currentNote, date: e.target.value })
                        }
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Note"
                        fullWidth
                        value={currentNote?.grade || ''}
                        onChange={(e) =>
                            setCurrentNote({ ...currentNote, grade: e.target.value })
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Annuler
                    </Button>
                    <Button onClick={handleSaveNote} color="primary">
                        Sauvegarder
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Notes;

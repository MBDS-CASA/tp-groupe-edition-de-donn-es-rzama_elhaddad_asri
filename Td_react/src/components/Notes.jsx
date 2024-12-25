import React, { useState } from 'react';
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
import data from '../data.json';

function Notes() {
    const [search, setSearch] = useState('');
    const [notesData, setNotesData] = useState(data);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);

    const handleSearchChange = (e) => setSearch(e.target.value);

    const filteredData = notesData.filter((item) => {
        const fullName = `${item.student.firstname} ${item.student.lastname}`.toLowerCase();
        const course = item.course.toLowerCase();
        const searchTerm = search.toLowerCase();
        return fullName.includes(searchTerm) || course.includes(searchTerm);
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
        if (currentNote.unique_id) {
            setNotesData((prevData) =>
                prevData.map((note) =>
                    note.unique_id === currentNote.unique_id ? currentNote : note
                )
            );
        } else {
            setNotesData((prevData) => [
                ...prevData,
                { ...currentNote, unique_id: Date.now() },
            ]);
        }
        handleCloseDialog();
    };

    const handleDeleteNote = (id) => {
        setNotesData((prevData) => prevData.filter((note) => note.unique_id !== id));
    };

    const handleDownloadCSV = () => {
        const csvRows = [
            ['ID', 'Cours', 'Prénom', 'Nom', 'Date', 'Note'],
            ...notesData.map((note) => [
                note.unique_id,
                note.course,
                note.student.firstname,
                note.student.lastname,
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
                            <TableRow key={item.unique_id}>
                                <TableCell style={{ color: 'white' }}>{item.unique_id}</TableCell>
                                <TableCell style={{ color: 'white' }}>{item.course}</TableCell>
                                <TableCell style={{ color: 'white' }}>
                                    {`${item.student.firstname} ${item.student.lastname}`}
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
                                        onClick={() => handleDeleteNote(item.unique_id)}
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
                    {currentNote?.unique_id ? 'Modifier' : 'Ajouter'} une note
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
                        value={currentNote?.student?.firstname || ''}
                        onChange={(e) =>
                            setCurrentNote({
                                ...currentNote,
                                student: { ...currentNote?.student, firstname: e.target.value },
                            })
                        }
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Nom de l'étudiant"
                        fullWidth
                        value={currentNote?.student?.lastname || ''}
                        onChange={(e) =>
                            setCurrentNote({
                                ...currentNote,
                                student: { ...currentNote?.student, lastname: e.target.value },
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

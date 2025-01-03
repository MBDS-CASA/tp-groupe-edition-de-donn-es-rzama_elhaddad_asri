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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

function Etudiants() {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState([]);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editedStudent, setEditedStudent] = useState({ firstname: '', lastname: '' });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ firstname: '', lastname: '' });
  const [loading, setLoading] = useState(false);  // For handling loading state
  const [error, setError] = useState(null); // For handling errors

  // Fetch students data when the component mounts
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8010/api/students')
        .then((response) => response.json())
        .then((data) => {
          setStudents(data);
          setLoading(false);
        })
        .catch((error) => {
          setError('Error fetching students');
          setLoading(false);
        });
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleEditClick = (id) => {
    const studentToEdit = students.find((item) => item.id === id);
    setEditingStudentId(id);
    setEditedStudent({
      firstname: studentToEdit.firstname,
      lastname: studentToEdit.lastname,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    setLoading(true);
    fetch(`http://localhost:8010/api/students/${editingStudentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedStudent),
    })
        .then((response) => response.json())
        .then((updatedStudent) => {
          setStudents((prev) =>
              prev.map((student) =>
                  student.id === updatedStudent.id ? updatedStudent : student
              )
          );
          setEditingStudentId(null);
          setEditedStudent({ firstname: '', lastname: '' });
          setLoading(false);
        })
        .catch((error) => {
          setError('Error updating student');
          setLoading(false);
        });
  };

  const handleDeleteClick = (id) => {
    setLoading(true);
    fetch(`http://localhost:8010/api/students/${id}`, {
      method: 'DELETE',
    })
        .then(() => {
          setStudents((prev) => prev.filter((student) => student.id !== id));
          setLoading(false);
        })
        .catch((error) => {
          setError('Error deleting student');
          setLoading(false);
        });
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = () => {
    setLoading(true);
    const newStudentData = { firstname: newStudent.firstname, lastname: newStudent.lastname };

    fetch('http://localhost:8010/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudentData),
    })
        .then((response) => response.json())
        .then((addedStudent) => {
          setStudents((prev) => [...prev, addedStudent]);
          setNewStudent({ firstname: '', lastname: '' });
          setIsAddDialogOpen(false);
          setLoading(false);
        })
        .catch((error) => {
          setError('Error adding student');
          setLoading(false);
        });
  };

  const filteredStudents = students.filter((item) => {
    const fullName = `${item.firstname} ${item.lastname}`.toLowerCase();
    const searchTerm = search.toLowerCase();
    return fullName.includes(searchTerm);
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
      <div>
        <TextField
            label="Rechercher par prénom ou nom"
            variant="outlined"
            fullWidth
            onChange={handleSearchChange}
            value={search}
            style={{ marginBottom: '20px' }}
        />

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <Button variant="contained" color="primary" onClick={() => setIsAddDialogOpen(true)}>
            Ajouter un étudiant
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Étudiant</TableCell>
                <TableCell>Prénom</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((item) => (
                  <TableRow key={item.id}>
                    {editingStudentId === item.id ? (
                        <>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>
                            <TextField
                                name="firstname"
                                value={editedStudent.firstname}
                                onChange={handleEditChange}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                                name="lastname"
                                value={editedStudent.lastname}
                                onChange={handleEditChange}
                            />
                          </TableCell>
                          <TableCell>
                            <Button color="primary" onClick={handleEditSave}>
                              Sauvegarder
                            </Button>
                            <Button color="secondary" onClick={() => setEditingStudentId(null)}>
                              Annuler
                            </Button>
                          </TableCell>
                        </>
                    ) : (
                        <>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.firstname}</TableCell>
                          <TableCell>{item.lastname}</TableCell>
                          <TableCell>
                            <IconButton color="primary" onClick={() => handleEditClick(item.id)}>
                              <Edit />
                            </IconButton>
                            <IconButton color="secondary" onClick={() => handleDeleteClick(item.id)}>
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

        <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
          <DialogTitle>Ajouter un étudiant</DialogTitle>
          <DialogContent>
            <TextField
                name="firstname"
                label="Prénom"
                value={newStudent.firstname}
                onChange={handleAddChange}
                fullWidth
            />
            <TextField
                name="lastname"
                label="Nom"
                value={newStudent.lastname}
                onChange={handleAddChange}
                fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddStudent} color="primary">
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

export default Etudiants;

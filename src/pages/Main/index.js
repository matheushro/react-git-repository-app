import { useState, useCallback } from "react"
import { Container, Form, List, SubmitButton, DeleteButton } from "./styles"
import {FaBars, FaGithub, FaPlus, FaSpinner, FaTrash} from 'react-icons/fa'

import api from "../../services/api";

export default function Main() {
    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([])
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = useCallback((e) => {
        setLoading(true);
        e.preventDefault();

        async function submit() {
            try {
                
                    const response = await api.get(`repos/${newRepo}`);

                    const data = {
                        name: response.data.full_name,
                    }
                    setRepositorios([...repositorios, data]);
                    setNewRepo('');
                
            } catch(error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
                
        }

        submit();
    }, [newRepo, repositorios]) 

    function handleInputChange(e) {
        setNewRepo(e.target.value);
    }

    const handleDelete = useCallback((repo) => {
        const find = repositorios.filter(r => r.name !== repo)
        setRepositorios(find);
    }, [repositorios])

    return (
        <div>
            <Container>
                <h1>
                    <FaGithub size={25}/>
                    Meus Repositorios
                </h1>

                <Form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Adicionar Repositórios" value={newRepo} onChange={handleInputChange} />
                    
                    <SubmitButton Loading={loading ? 1 : 0}>
                        {
                            loading ? (
                                <FaSpinner color="#FFF" size={14}/>
                            ) : (
                                <FaPlus color="#FFF" size={14} />
                            )
                        }
                    </SubmitButton>
                </Form>

                <List>
                    {repositorios.map(repo => (
                        <li key={repo.name}>
                            <span>
                                <DeleteButton onClick={()=> handleDelete(repo.name)}>
                                    <FaTrash size={14}/>
                                </DeleteButton>
                                {repo.name}
                            </span>
                            <a href="">
                                <FaBars size="20" />
                            </a>
                        </li>
                    ))}
                </List>
            </Container>
        </div>
    )
}
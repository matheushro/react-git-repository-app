import { useState, useCallback, useEffect } from "react"
import { Container, Form, List, SubmitButton, DeleteButton } from "./styles"
import {FaBars, FaGithub, FaPlus, FaSpinner, FaTrash} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import api from "../../services/api";

export default function Main() {
    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([])
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);



    //busca
    useEffect(()=> {
        const repoStorage = localStorage.getItem('repos');

        if(repoStorage){
            setRepositorios(JSON.parse(repoStorage))
        }
    }, [])


    //salva
    useEffect(() => {
        localStorage.setItem('repos', JSON.stringify(repositorios))
    }, [repositorios])

    
    const handleSubmit = useCallback((e) => {
        
        e.preventDefault();

        async function submit() {
            setLoading(true);
            setAlert(null)
            try {

                if(newRepo === ''){
                    throw new Error('Você precisa indicar um repositório.');
                }
                
                const response = await api.get(`repos/${newRepo}`);

                const hasRepo = repositorios.find(repo => repo.name === newRepo)

                if(hasRepo){
                    throw new Error('Repositório duplicado')
                }
                const data = {
                    name: response.data.full_name,
                }
                setRepositorios([...repositorios, data]);
                setNewRepo('');
                
            } catch(error) {
                console.log(error)
                setAlert(true)
            } finally {
                setLoading(false);
            }
                
        }

        submit();
    }, [newRepo, repositorios]) 

    function handleInputChange(e) {
        setAlert(null)
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

                <Form onSubmit={handleSubmit} error={alert}>
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
                            <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                                <FaBars size="20" />
                            </Link>
                        </li>
                    ))}
                </List>
            </Container>
        </div>
    )
}
import { useParams } from 'react-router-dom';
import { Container, Owner, Loading, BackButton, IssuesList, PageActions, PageFilter } from './styles';
import api from '../../services/api'
import { FaArrowLeft } from 'react-icons/fa'
import { useEffect, useState } from 'react';

export default function Repositorio({match}){
    const { repositorio } = useParams();

    const [repositorios, setRepositorios] = useState({})
    const [issues, setIssues] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState('1')
    const [filtroRepositorio, setFiltroRepositorio] = useState('all')

    useEffect(() => {
        async function load(){
            const nomeRepo = repositorio;
            
            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`, {
                    params:{
                        state: filtroRepositorio,
                        per_page: 5
                    }
                })
            ]);

            setRepositorios(repositorioData.data)
            setIssues(issuesData.data)
            setLoading(false)
        }
        load();
    }, [filtroRepositorio, repositorio]);


    useEffect(()=> {

        async function loadIssue(){
            const nomeRepo = repositorio;
            const response = await api.get(`/repos/${nomeRepo}/issues`, {
                params:{
                    state: filtroRepositorio,
                    page,
                    per_page: 5
                }
            })

            setIssues(response.data)
        }
        
        loadIssue();

    }, [filtroRepositorio, repositorio, page])

    function handlePage(action){
        setPage(action === 'back' ? page - 1 : page +1)
    }
  
    function handleFilter(action){
        setFiltroRepositorio(action)
    }

    if(loading){
        return(
            <Loading>
                <h1>Carregando...</h1>
            </Loading>
        )
    }
    return (
        <Container>
            <BackButton to="/">
                <FaArrowLeft color="black" size={30} />
            </BackButton>
            <Owner>
                <img src={repositorios.owner.avatar_url} alt={repositorios.owner.login}/>
                <h1>{repositorios.name}</h1>
                <p>{repositorios.description}</p>
                <PageFilter>
                    <button type="button" onClick={()=> handleFilter('all') } disabled={filtroRepositorio === 'all'}>
                        All
                    </button>
                    <button type="button" onClick={() => handleFilter('open') } disabled={filtroRepositorio === 'open'}>
                        Open
                    </button>
                    <button type="button" onClick={() => handleFilter('closed') } disabled={filtroRepositorio === 'closed'}>
                        Closed
                    </button>
                </PageFilter>
            </Owner>

            <IssuesList>
                {issues.map(issue => (
                    <li key={String(issue.id)}>
                        <img src={issue.user.avatar_url} alt={issue.user.login}/>
                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>

                                {issue.labels.map(label => (
                                    <span key={String(label.id)}>{label.name}</span>
                                ))}
                                
                            </strong>
                            <p>{issue.user.login}</p>
                        </div>
                    </li>
                ))}

                <PageActions>
                    <button type="button" onClick={()=> handlePage('next') } disabled={page < 2}>
                        Voltar
                    </button>
                    <button type="button" onClick={() => handlePage('next') }>
                        Próxima
                    </button>
                </PageActions>
            </IssuesList>
        </Container>
        
        
    )
}
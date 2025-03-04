import {
	Briefcase,
    ListTask,
    People,
    Bullseye
} from 'react-bootstrap-icons';

export const ProjectsStats = [
    {
        id:2,
        title : "Layanan",
        value : "Sekretaris",
        icon: <ListTask size={18}/>,
        statInfo: '<span className="text-dark me-2"></span> Desa' 
     },
     {
        id:3,
        title : "Layanan",
        value : "Keuangan",
        icon: <People/>,
        statInfo: '<span className="text-dark me-2"></span> Desa' 
     },
     
];
export default ProjectsStats;

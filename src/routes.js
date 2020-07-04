import MyTree from './components/MyTree' ;
import PostingPage from './components/Forum' ;

const routes= [
	{
		path: '/',
		component: MyTree,
		breadcrumbName: '首頁'
	},
	{
		path: '/forum',
		component: PostingPage,
		breadcrumbName: '論壇'
	}
];

export default routes;

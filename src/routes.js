import MyTree from './components/MyTree' ;
import PostingPage from './components/Forum' ;

var data = treeData

const routes= [
	{
		path: '/:data',
		component: MyTree,
		exact: true,
		breadcrumbName: '首頁'
	},
	{
		path: '/forum',
		component: PostingPage,
		breadcrumbName: '論壇'
	}
];

export default routes;

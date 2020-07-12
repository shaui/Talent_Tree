import MyTree from './components/MyTree' ;
import PostingPage from './components/Forum' ;
import Firebase from './Utils/FirebaseMg.js'


const routes= [
	{
		path: '/',
		component: MyTree,
		exact: true,
		breadcrumbName: '首頁'
	},
	{
		path: '/forum',
		component: PostingPage,
		breadcrumbName: '論壇'
	},
	{
		path: '/firebase',
		component: Firebase,
		breadcrumbName: '資料庫'
	}
];

export default routes;

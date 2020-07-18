import MyTree from './components/MyTree' ;
import PostsPage from './components/Forum' ;
import Firebase from './Utils/FirebaseMg.js'
import CoursePage from './components/CoursePage'
import SignInPage from './components/SignInPage.js'

const routes= [
	{
		path: '/',
		component: MyTree,
		exact: true,
		breadcrumbName: '首頁'
	},
	{
		path: '/forum',
		component: PostsPage,
		exact: true,
		breadcrumbName: '論壇'
	},
	{
		path: '/firebase',
		component: Firebase,
		breadcrumbName: '資料庫'
	},
	{
		path: '/signIn',
		component: SignInPage,
		breadcrumbName: '登入'
	},
	{
		path: '/coursePage',
		component: CoursePage,
		breadcrumbName: '課程'
	}
];

export default routes;

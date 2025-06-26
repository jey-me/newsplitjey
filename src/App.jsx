import { Routes, Route } from 'react-router-dom';
import LayoutWithNav from './layout/LayoutWithNav';
import HomePage from './pages/HomePage';
import ExpensesPage from './pages/ExpensesPage';
import ShoppingPage from './pages/ShoppingPage';
import NotFound from './pages/NotFound.jsx';
import GroupPage from './pages/GroupPage.jsx';
import CreateGroupPage from './pages/CreateGroupPage';
import CreateEventPage from './pages/CreateEventPage';

import AddExpensePopup from './components/popups/AddExpensePopup';
import AddShoppingItemPopup from './components/popups/AddShoppingItemPopup';
import ChangeEventNamePopup from './components/popups/ChangeEventNamePopup';
import ManageMembersPopup from './components/popups/ManageMembersPopup';
import { usePopupStore } from './store/usePopupStore';


export default function App() {
  const { currentPopup } = usePopupStore();
  return (
    <>
    <Routes>

      {/* Create Pages */}
      <Route path="/create-group" element={<CreateGroupPage />} />
      <Route path="/create-event" element={<CreateEventPage />} />

      <Route path="/:groupSlug/*" element={<LayoutWithNav />}>
        <Route index element={<GroupPage />} />

        <Route path=":eventSlug/*" element={<LayoutWithNav />}>
          <Route path="Home" element={<HomePage />} />
          <Route path="Expenses" element={<ExpensesPage />} />
          <Route path="Shopping" element={<ShoppingPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
      
    </Routes>

      {currentPopup === "expense" && <AddExpensePopup />}
      {currentPopup === "shopping" && <AddShoppingItemPopup />}
      {currentPopup === "changeEventName" && <ChangeEventNamePopup />}
      {currentPopup === "manageMembers" && <ManageMembersPopup />}
      </>
  );
}

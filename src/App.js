import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Main from './pages/main/Main';
import TrashcanDetail from './pages/main/TrashcanDetail';
import Product from './pages/product/Product';
import ProductDetail from './pages/product/ProductDetail';
import BoardList from './pages/board/BoardList';
import Board from './pages/board/Board';
import BoardCreate from './pages/board/BoardCreate';
import BoardMap from './pages/board/BoardMap';
import MyPage from './pages/mypage/MyPage';
import UpdateInfoPage from './pages/update/UpdateInfoPage';
import UpdateNamePage from './pages/update/UpdateNamePage';
import UpdatePhonePage from './pages/update/UpdatePhonePage';
import ConfirmPasswordPage from './pages/update/ConfirmPasswordPage';
import UpdatePasswordPage from './pages/update/UpdatePasswordPage';
import SignUpPage from './pages/auth/SignUpPage';
import LoginPage from './pages/auth/LoginPage';
import FindIdPage from './pages/auth/FindIdPage';
import FindPasswordPage from './pages/auth/FindPasswordPage';
import AdminBoardList from "./pages/admin/AdminBoardList";
import AdminEctBoard from "./pages/admin/AdminEctBoard";
import AdminModifyBoard from "./pages/admin/AdminModifyBoard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/trashcan-detail" element={<TrashcanDetail />} />
        <Route path="/products" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/boardList" element={<BoardList />} />
        <Route path="/board/:boardId" element={<Board />} />
        <Route path="/boardcreate" element={<BoardCreate />} />
        <Route path="/boardmap" element={<BoardMap />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/update" element={<UpdateInfoPage />} />
        <Route path="/update-name" element={<UpdateNamePage />} />
        <Route path="/update-phone" element={<UpdatePhonePage />} /> 
        <Route path="/confirm-password" element={<ConfirmPasswordPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/find-id" element={<FindIdPage />} /> 
        <Route path="/find-password" element={<FindPasswordPage />} />
        <Route path="/admin/boardList" element={<AdminBoardList />} />
        <Route path="/admin/ectBoard/:boardId" element={<AdminEctBoard/> } />
        <Route path="/admin/modifyBoard/:boardId" element={<AdminModifyBoard/> } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// src/services/MyPageService.js
import myPageAxios from '../MyPageAxios';

export const fetchUserInfo = async () => {
  try {
    const response = await myPageAxios.get('/api/users/my-page');
    return response.data.data;
  } catch (error) {
    console.error('사용자 정보 불러오기 오류:', error);
    throw error;
  }
};

export const fetchUserPoints = async () => {
  try {
    const response = await myPageAxios.get('/api/points/user');
    return response.data.data.point;
  } catch (error) {
    console.error('포인트 불러오기 오류:', error);
    throw error;
  }
};

export const fetchUserGifticons = async () => {
  try {
    const response = await myPageAxios.get('/api/gifticons/user');
    return response.data.data;
  } catch (error) {
    console.error('기프티콘 불러오기 오류:', error);
    throw error;
  }
};

export const fetchUserBoards = async () => {
  try {
    const response = await myPageAxios.get('/api/boards/my');
    return response.data.data.map(board => ({
      boardFirstImgUrl: board.boardFirstImgUrl,
      roadNameAddress: board.roadNameAddress,
      detailedAddress: board.detailedAddress,
    }));
  } catch (error) {
    console.error('게시글 불러오기 오류:', error);
    throw error;
  }
};

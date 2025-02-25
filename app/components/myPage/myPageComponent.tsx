'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { PostContent as CommunityPostContent, CommunityPost } from '@/app/components/community/communityComponents'; 


interface UserInfoData {
  image: string;
  userName: string;
  nationality: string;
  religion: string;
  allergies: string[];
  chronicDiseases: string[];
  dietaryPreferences: string[];
}



const MyPage = () => {
  const [userInfo, setUserInfo] = useState<UserInfoData | null>(null);
  const [activeTab, setActiveTab] = useState<'liked' | 'myPost'>('liked');
  const [postData, setPostData] = useState<CommunityPost[]>([]);
  const router = useRouter();

  // 토큰 가져오기 함수
  const getAuthToken = () => {
    const token = localStorage.getItem('Authorization');
    if (!token) {
      console.error('Authorization token not found');
    }
    return token;
  };

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ROOT_API}/users/myinfo`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          console.error('Failed to fetch user info:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  // 게시글 정보 가져오기
  useEffect(() => {
    const fetchPostData = async () => {
      const token = getAuthToken();
      if (!token) return;

      const endpoint =
        activeTab === 'liked'
          ? `${process.env.NEXT_PUBLIC_ROOT_API}/community/likedCommunities`
          : `${process.env.NEXT_PUBLIC_ROOT_API}/community/myCommunities`;

      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const formattedPosts: CommunityPost[] = data.content.map((post: CommunityPost) => ({
            communityKey: post.communityKey, // number 그대로 유지
            title: post.title,
            content: post.content,
            imageUrls: post.imageUrls || [],
            likeCount: post.likeCount || 0,
            profileImage: post.profileImage || '',
            userName: post.userName || '',
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            category: post.category || 'ALL',
            liked: post.liked || false,
          }));

          setPostData(formattedPosts);
        } else {
          console.error('Failed to fetch posts:', response.status);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPostData();
  }, [activeTab]);

  return (
    <>
      <Container>
        <CustomHeader>
          <BackIcon onClick={() => router.back()}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
    </svg>
  </BackIcon>
          <Title>My Page</Title>
          <SettingsIcon onClick={() => router.push('/settings')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M16.2446 25.9584H11.7554C11.4561 25.9584 11.1967 25.8588 10.9772 25.6595C10.7577 25.4601 10.6281 25.211 10.5881 24.9121L10.229 22.1317C9.96963 22.0321 9.72541 21.9125 9.49636 21.773C9.26651 21.6335 9.04184 21.484 8.82237 21.3246L6.21859 22.4008C5.93926 22.5005 5.65992 22.5104 5.38059 22.4307C5.10126 22.351 4.88178 22.1816 4.72217 21.9225L2.50746 18.0659C2.34784 17.8068 2.29796 17.5278 2.35782 17.2288C2.41767 16.9299 2.56731 16.6907 2.80674 16.5113L5.05138 14.8073C5.03143 14.6678 5.02145 14.533 5.02145 14.4031V13.5959C5.02145 13.4667 5.03143 13.3324 5.05138 13.1929L2.80674 11.4888C2.56731 11.3095 2.41767 11.0703 2.35782 10.7713C2.29796 10.4724 2.34784 10.1933 2.50746 9.93425L4.72217 6.07769C4.86183 5.79866 5.07612 5.62407 5.36503 5.55391C5.65474 5.48455 5.93926 5.4997 6.21859 5.59935L8.82237 6.6756C9.04184 6.51616 9.27129 6.36668 9.51072 6.22716C9.75015 6.08765 9.98958 5.96807 10.229 5.86841L10.5881 3.0881C10.6281 2.78914 10.7577 2.54001 10.9772 2.34071C11.1967 2.1414 11.4561 2.04175 11.7554 2.04175H16.2446C16.5439 2.04175 16.8033 2.1414 17.0228 2.34071C17.2422 2.54001 17.3719 2.78914 17.4118 3.0881L17.771 5.86841C18.0304 5.96807 18.275 6.08765 18.5048 6.22716C18.7339 6.36668 18.9581 6.51616 19.1776 6.6756L21.7814 5.59935C22.0607 5.4997 22.3401 5.48973 22.6194 5.56946C22.8987 5.64918 23.1182 5.81859 23.2778 6.07769L25.4925 9.93425C25.6522 10.1933 25.702 10.4724 25.6422 10.7713C25.5823 11.0703 25.4327 11.3095 25.1932 11.4888L22.9486 13.1929C22.9686 13.3324 22.9785 13.4667 22.9785 13.5959V14.4031C22.9785 14.533 22.9586 14.6678 22.9187 14.8073L25.1633 16.5113C25.4027 16.6907 25.5524 16.9299 25.6122 17.2288C25.6721 17.5278 25.6222 17.8068 25.4626 18.0659L23.2479 21.8926C23.0883 22.1517 22.864 22.3263 22.5751 22.4164C22.2854 22.5056 22.0009 22.5005 21.7215 22.4008L19.1776 21.3246C18.9581 21.484 18.7287 21.6335 18.4893 21.773C18.2498 21.9125 18.0104 22.0321 17.771 22.1317L17.4118 24.9121C17.3719 25.211 17.2422 25.4601 17.0228 25.6595C16.8033 25.8588 16.5439 25.9584 16.2446 25.9584ZM14.0599 18.1855C15.2171 18.1855 16.2047 17.7769 17.0228 16.9598C17.8408 16.1426 18.2498 15.1561 18.2498 14.0001C18.2498 12.8441 17.8408 11.8575 17.0228 11.0404C16.2047 10.2232 15.2171 9.81466 14.0599 9.81466C12.8827 9.81466 11.8898 10.2232 11.0814 11.0404C10.2737 11.8575 9.86986 12.8441 9.86986 14.0001C9.86986 15.1561 10.2737 16.1426 11.0814 16.9598C11.8898 17.7769 12.8827 18.1855 14.0599 18.1855ZM14.0599 15.7938C13.561 15.7938 13.1373 15.6192 12.7885 15.2701C12.4389 14.9217 12.2641 14.4983 12.2641 14.0001C12.2641 13.5018 12.4389 13.0785 12.7885 12.7301C13.1373 12.3809 13.561 12.2063 14.0599 12.2063C14.5587 12.2063 14.9828 12.3809 15.3324 12.7301C15.6812 13.0785 15.8556 13.5018 15.8556 14.0001C15.8556 14.4983 15.6812 14.9217 15.3324 15.2701C14.9828 15.6192 14.5587 15.7938 14.0599 15.7938ZM12.8029 23.5667H15.1672L15.5862 20.3978C16.2047 20.2383 16.7786 20.004 17.3077 19.6946C17.836 19.3861 18.3197 19.0126 18.7586 18.5741L21.7215 19.7999L22.8888 17.767L20.3149 15.8237C20.4147 15.5447 20.4845 15.2505 20.5244 14.9412C20.5643 14.6327 20.5843 14.319 20.5843 14.0001C20.5843 13.6812 20.5643 13.3671 20.5244 13.0578C20.4845 12.7492 20.4147 12.4555 20.3149 12.1764L22.8888 10.2332L21.7215 8.20029L18.7586 9.45591C18.3197 8.99751 17.836 8.61365 17.3077 8.30433C16.7786 7.9958 16.2047 7.76182 15.5862 7.60237L15.1971 4.43341H12.8328L12.4138 7.60237C11.7953 7.76182 11.2218 7.9958 10.6935 8.30433C10.1644 8.61365 9.68032 8.98755 9.24137 9.42602L6.27845 8.20029L5.11124 10.2332L7.68508 12.1465C7.58532 12.4455 7.51549 12.7445 7.47559 13.0434C7.43568 13.3424 7.41573 13.6613 7.41573 14.0001C7.41573 14.319 7.43568 14.6279 7.47559 14.9269C7.51549 15.2258 7.58532 15.5248 7.68508 15.8237L5.11124 17.767L6.27845 19.7999L9.24137 18.5442C9.68032 19.0027 10.1644 19.3861 10.6935 19.6946C11.2218 20.004 11.7953 20.2383 12.4138 20.3978L12.8029 23.5667Z" fill="#1E252F"/>
            </svg>
          </SettingsIcon>
        </CustomHeader>

        {/* 사용자 프로필 */}
        <ProfileSection>
          <Avatar style={{ backgroundImage: `url(${userInfo?.image})`}} />
          <UserInfo>
            <Username>{userInfo?.userName || 'Loading...'}</Username>
            <Location>{userInfo?.nationality || 'Loading...'}</Location>
            <Tags>
              {userInfo?.religion && <Tag color="#FFD700">{userInfo.religion}</Tag>}
            </Tags>
            <Tags>
              {userInfo?.allergies?.map((tag, index) => (
                <Tag key={index} color="#DFF2BF">{tag}</Tag>
              ))}
            </Tags>
            <Tags>
              {userInfo?.dietaryPreferences?.map((tag, index) => (
                <Tag key={index} color="#CEDDF2">{tag}</Tag>
              ))}
            </Tags>
            <Tags>
              {userInfo?.chronicDiseases?.map((tag, index) => (
                <Tag key={index} color="#F6c1ce">{tag}</Tag>
              ))}
            </Tags>
          </UserInfo>
        </ProfileSection>

        {/* 탭 */}
        <TabBar>
          <Tab isActive={activeTab === 'liked'} onClick={() => setActiveTab('liked')}>
            Liked
          </Tab>
          <Tab isActive={activeTab === 'myPost'} onClick={() => setActiveTab('myPost')}>
            My Post
          </Tab>
        </TabBar>

        {/* 게시글 목록 */}
        <PostContainer>
          {postData.length > 0 ? (
            activeTab === 'liked' ? (
              <PostsGrid>
                {postData.map((post) => (
                  <PostCard key={post.communityKey}>
                    <PostImage src={post.imageUrls[0]} alt={post.title} />
                    <PostTitle>{post.title}</PostTitle>
                    <PostDescription>{post.content}</PostDescription>
                  </PostCard>
                ))}
              </PostsGrid>
            ) : (
              postData.map((post) => (
                <CommunityPostContent key={post.communityKey} post={post} useManyImage={false} />
              ))
            )
          ) : (
            <NoPostsMessage>No posts yet.</NoPostsMessage>
          )}
        </PostContainer>
      </Container>
      
    </>
  );
};

export default MyPage;


const Container = styled.div`
  position: relative;
  margin: 0 auto;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  width: 100%;
  //height: 52.75rem;
  min-height: 300px; /* 최소 높이 설정 */
  justify-content: flex-start; /* 게시글이 없을 때도 상단 유지 */
  align-items: center;
  padding-top: 3.5rem;
`;

const CustomHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  height: 3.5rem;
  flex-shrink: 0;
`;

const BackIcon = styled.div`
  cursor: pointer;
  position: absolute;
  left: 16px;
  svg {
    width: 28px;
    height: 28px;
    fill: #1E252F;
  }
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin: 0 auto;
  color: var(--Gray-gray-900, #0B0B0B);
  text-align: center;
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: SUIT;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const SettingsIcon = styled.div`
  cursor: pointer;
  position: absolute;
  right: 16px;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: flex-start;
  background-color: #FFF;
  border-bottom: 1px solid #E0E5EB;
  width: 100%;
  padding: 16px; 
  box-sizing: border-box;
  flex-wrap: wrap; 
`;

const Avatar = styled.div`
  width: 6.25rem;
  height: 6.25rem;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: #ccc;
  background-size: cover;
  background-position: center;
  margin-right: 16px;
`;

const UserInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Username = styled.div`
  color: var(--Gray-gray-900, #0B0B0B);
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: SUIT;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const Location = styled.div`
  color: #6A7784;
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: SUIT;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const Tags = styled.div`
  display: inline-flex;
  flex-wrap: wrap; /* 태그가 많으면 줄 바꿈 */
  gap: 0.25rem;
  margin-top: 0.38px;
  padding: 0.38px 0.25px;
  align-items: center;
  color: #6A7784;
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: SUIT;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  
`;

const Tag = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  padding: 0.125rem 0.75rem;
  border-radius: 3.125rem;
  border: 1px solid #1E252F;
  color: #1E252F;
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: SUIT;
  font-size: 0.6875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const TabBar = styled.div`
  display: flex;
  justify-content: space-around;
  background-color: #fff;
  padding: 1.5rem 0 1rem 1.5rem;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
  width: 100%;
  height: 3.75rem;
  flex-shrink: 0;
`;

const Tab = styled.div<{ isActive: boolean }>`
  cursor: pointer;
  color: ${(props) => (props.isActive ? 'blue' : '#000')};
  border-bottom: ${(props) => (props.isActive ? '2px solid black' : 'none')};
  color: #0A0C10;
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: SUIT;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  
`;

const PostContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1; 
  min-height: 52.75rem; 
  justify-content: flex-start;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75px;
  padding: 16px;
  width: 100%;
  flex-shrink: 0;
`;

const PostCard = styled.div`
  overflow: hidden;
  height: 200px; /* 일정한 높이를 설정 */
`;



const PostImage = styled.img`
  width: 97.7%;
  height: 97.7%;
  flex-shrink: 0;
  border-radius: 0.5rem;
`;


const PostTitle = styled.h3`
  font-size: 14px;
  margin: 8px;
`;

const PostDescription = styled.p`
  font-size: 12px;
  margin: 0 8px 8px;
`;




const NoPostsMessage = styled.p`
  text-align: center;
  color: #666;
   margin-top: 20px; /* 기본 여백 추가 */
`;
import { Member, Event, PurchaseOption } from '@/types/fashion';

export const members: Member[] = [
  {
    id: 'heeseung',
    name: '이희승',
    stageName: '희승',
    image: 'https://i.imgur.com/8XZQZQZ.jpg'
  },
  {
    id: 'jay',
    name: '박제이',
    stageName: '제이',
    image: 'https://i.imgur.com/9Y9Y9Y9.jpg'
  },
  {
    id: 'jake',
    name: '심재윤',
    stageName: '제이크',
    image: 'https://i.imgur.com/7X7X7X7.jpg'
  },
  {
    id: 'sunghoon',
    name: '박성훈',
    stageName: '성훈',
    image: 'https://i.imgur.com/6X6X6X6.jpg'
  },
  {
    id: 'sunoo',
    name: '김선우',
    stageName: '선우',
    image: 'https://i.imgur.com/5X5X5X5.jpg'
  },
  {
    id: 'jungwon',
    name: '양정원',
    stageName: '정원',
    image: 'https://i.imgur.com/4X4X4X4.jpg'
  },
  {
    id: 'niki',
    name: '니시키',
    stageName: '니키',
    image: 'https://i.imgur.com/3X3X3X3.jpg'
  }
];

export const events: Event[] = [
  {
    id: 'music-bank-2024-03',
    name: '뮤직뱅크',
    date: '2024-03-15',
    type: 'MUSIC_SHOW',
    outfits: [
      {
        id: 'heeseung-music-bank-2024-03',
        date: '2024-03-15',
        event: '뮤직뱅크',
        memberId: 'heeseung',
        items: [
          {
            id: 'heeseung-jacket-1',
            name: '베이지 트렌치 코트',
            brand: 'Burberry',
            price: 2500000,
            purchaseLink: 'https://www.burberry.com/kr/',
            image: '/outfits/heeseung-jacket-1.jpg',
            purchaseOptions: [
              {
                store: 'Burberry 공식몰',
                price: 2500000,
                link: 'https://www.burberry.com/kr/',
                inStock: true,
                lastChecked: '2024-03-20'
              },
              {
                store: 'SSENSE',
                price: 2300000,
                link: 'https://www.ssense.com/',
                inStock: true,
                lastChecked: '2024-03-20'
              },
              {
                store: 'FARFETCH',
                price: 2450000,
                link: 'https://www.farfetch.com/',
                inStock: false,
                lastChecked: '2024-03-20'
              }
            ],
            availability: 'IN_STOCK',
            lastUpdated: '2024-03-20'
          },
          {
            id: 'heeseung-shirt-1',
            name: '화이트 셔츠',
            brand: 'Saint Laurent',
            price: 890000,
            purchaseLink: 'https://www.ysl.com/',
            image: '/outfits/heeseung-shirt-1.jpg',
            purchaseOptions: [
              {
                store: 'Saint Laurent 공식몰',
                price: 890000,
                link: 'https://www.ysl.com/',
                inStock: true,
                lastChecked: '2024-03-20'
              },
              {
                store: 'NET-A-PORTER',
                price: 850000,
                link: 'https://www.net-a-porter.com/',
                inStock: true,
                lastChecked: '2024-03-20'
              }
            ],
            availability: 'IN_STOCK',
            lastUpdated: '2024-03-20'
          }
        ],
        images: ['/outfits/heeseung-music-bank-2024-03-1.jpg'],
        description: '뮤직뱅크 출연 의상'
      },
      {
        id: 'jay-music-bank-2024-03',
        date: '2024-03-15',
        event: '뮤직뱅크',
        memberId: 'jay',
        items: [
          {
            id: 'jay-jacket-1',
            name: '블랙 가죽 자켓',
            brand: 'Balenciaga',
            price: 3200000,
            purchaseLink: 'https://www.balenciaga.com/',
            image: '/outfits/jay-jacket-1.jpg'
          },
          {
            id: 'jay-pants-1',
            name: '슬림핏 데님',
            brand: 'Diesel',
            price: 450000,
            purchaseLink: 'https://www.diesel.com/',
            image: '/outfits/jay-pants-1.jpg'
          }
        ],
        images: ['/outfits/jay-music-bank-2024-03-1.jpg'],
        description: '뮤직뱅크 출연 시 착용한 스트릿 룩'
      }
    ]
  },
  {
    id: 'inkigayo-2024-03',
    name: '인기가요',
    date: '2024-03-17',
    type: 'MUSIC_SHOW',
    outfits: [
      {
        id: 'jake-inkigayo-2024-03',
        date: '2024-03-17',
        event: '인기가요',
        memberId: 'jake',
        items: [
          {
            id: 'jake-sweater-1',
            name: '그레이 니트',
            brand: 'Acne Studios',
            price: 780000,
            purchaseLink: 'https://www.acnestudios.com/',
            image: '/outfits/jake-sweater-1.jpg'
          },
          {
            id: 'jake-pants-1',
            name: '와이드 슬랙스',
            brand: 'Isabel Marant',
            price: 650000,
            purchaseLink: 'https://www.isabelmarant.com/',
            image: '/outfits/jake-pants-1.jpg'
          }
        ],
        images: ['/outfits/jake-inkigayo-2024-03-1.jpg'],
        description: '인기가요 출연 시 착용한 캐주얼 룩'
      }
    ]
  },
  {
    id: 'fanmeeting-2024-03',
    name: '팬미팅',
    date: '2024-03-20',
    type: 'FANMEETING',
    outfits: [
      {
        id: 'sunghoon-fanmeeting-2024-03',
        date: '2024-03-20',
        event: '팬미팅',
        memberId: 'sunghoon',
        items: [
          {
            id: 'sunghoon-shirt-1',
            name: '스트라이프 셔츠',
            brand: 'Thom Browne',
            price: 1200000,
            purchaseLink: 'https://www.thombrowne.com/',
            image: '/outfits/sunghoon-shirt-1.jpg'
          },
          {
            id: 'sunghoon-pants-1',
            name: '크롭 팬츠',
            brand: 'Thom Browne',
            price: 980000,
            purchaseLink: 'https://www.thombrowne.com/',
            image: '/outfits/sunghoon-pants-1.jpg'
          }
        ],
        images: ['/outfits/sunghoon-fanmeeting-2024-03-1.jpg'],
        description: '팬미팅에서 착용한 프레피 룩'
      }
    ]
  }
]; 
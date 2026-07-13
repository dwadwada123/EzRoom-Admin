import { useState } from "react";
import { Tabs, Table, Modal, Input, Badge, Select, message, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// Moderation datasets aligning with Android Property & Room models
const initialPendingData = [
  {
    id: "p1",
    title: "Phòng trọ cao cấp có ban công, đủ đồ (P.201)",
    hostName: "Trần Quốc Bảo",
    price: 4500000,
    priceFormatted: "4.500.000 đ/tháng",
    electricityPrice: 3500,
    waterPrice: 15000,
    address: "Quận 3, TP. Hồ Chí Minh",
    detailedAddress: "Tầng 2 - Phòng 201, 123 Điện Biên Phủ",
    description: "Phòng trọ diện tích 30m2 đầy đủ nội thất: giường tủ, tủ lạnh, điều hòa, máy giặt. Có ban công thoáng mát hướng gió Nam.",
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600",
    structure: "SINGLE",
    floorArea: 30,
    mezzanineArea: 10,
    propertyId: "prop1",
    propertyName: "Tòa nhà Quốc Bảo Luxury",
    propertyType: "COMPLEX",
    commonAmenities: [
      { name: "Thang máy", compensationAmount: 0 },
      { name: "Bảo vệ 24/7", compensationAmount: 0 },
      { name: "Camera an ninh", compensationAmount: 0 }
    ],
    amenities: [
      { name: "WiFi", compensationAmount: 500000 },
      { name: "Điều hòa", compensationAmount: 1000000 },
      { name: "Máy giặt", compensationAmount: 1500000 },
      { name: "Nóng lạnh", compensationAmount: 800000 },
      { name: "Tủ quần áo", compensationAmount: 1200000 }
    ]
  },
  {
    id: "p1_sub1",
    title: "Phòng trọ cao cấp có ban công, đủ đồ (P.202)",
    hostName: "Trần Quốc Bảo",
    price: 4700000,
    priceFormatted: "4.700.000 đ/tháng",
    electricityPrice: 3500,
    waterPrice: 15000,
    address: "Quận 3, TP. Hồ Chí Minh",
    detailedAddress: "Tầng 2 - Phòng 202, 123 Điện Biên Phủ",
    description: "Phòng diện tích 32m2 có ban công rộng, đầy đủ nội thất cơ bản.",
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600",
    structure: "SINGLE",
    floorArea: 32,
    mezzanineArea: 10,
    propertyId: "prop1",
    propertyName: "Tòa nhà Quốc Bảo Luxury",
    propertyType: "COMPLEX",
    commonAmenities: [
      { name: "Thang máy", compensationAmount: 0 },
      { name: "Bảo vệ 24/7", compensationAmount: 0 }
    ],
    amenities: [
      { name: "WiFi", compensationAmount: 500000 },
      { name: "Điều hòa", compensationAmount: 1000000 }
    ]
  },
  {
    id: "p1_sub2",
    title: "Phòng trọ studio ban công lớn (P.301)",
    hostName: "Trần Quốc Bảo",
    price: 5000000,
    priceFormatted: "5.000.000 đ/tháng",
    electricityPrice: 3500,
    waterPrice: 15000,
    address: "Quận 3, TP. Hồ Chí Minh",
    detailedAddress: "Tầng 3 - Phòng 301, 123 Điện Biên Phủ",
    description: "Phòng studio cao cấp nhất tòa nhà, cửa sổ kính tràn viền view phố cực đẹp.",
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600",
    structure: "SINGLE",
    floorArea: 35,
    mezzanineArea: 12,
    propertyId: "prop1",
    propertyName: "Tòa nhà Quốc Bảo Luxury",
    propertyType: "COMPLEX",
    commonAmenities: [
      { name: "Thang máy", compensationAmount: 0 },
      { name: "Bảo vệ 24/7", compensationAmount: 0 }
    ],
    amenities: [
      { name: "WiFi", compensationAmount: 500000 },
      { name: "Điều hòa", compensationAmount: 1000000 }
    ]
  },
  {
    id: "p2",
    title: "Căn hộ dịch vụ studio mini giá rẻ",
    hostName: "Lê Hoài Nam",
    price: 3200000,
    priceFormatted: "3.200.000 đ/tháng",
    electricityPrice: 4000,
    waterPrice: 18000,
    address: "Bình Thạnh, TP. Hồ Chí Minh",
    detailedAddress: "Số 45/12 Đường D5, Phường 25",
    description: "Phòng trọ khép kín an ninh tốt, giờ giấc tự do, có chỗ để xe máy miễn phí tầng trệt.",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600",
    structure: "APARTMENT",
    floorArea: 25,
    mezzanineArea: 0,
    propertyId: null,
    propertyName: null,
    propertyType: "SINGLE",
    commonAmenities: [],
    amenities: [
      { name: "WiFi", compensationAmount: 500000 },
      { name: "Điều hòa", compensationAmount: 1000000 },
      { name: "Thang máy", compensationAmount: 0 },
      { name: "Khóa vân tay", compensationAmount: 1500000 }
    ]
  },
  {
    id: "p3",
    title: "Phòng trọ ghép tiện nghi cho sinh viên (Phòng A)",
    hostName: "Phạm Thu Hương",
    price: 1800000,
    priceFormatted: "1.800.000 đ/tháng",
    electricityPrice: 3500,
    waterPrice: 15000,
    address: "Cầu Giấy, Hà Nội",
    detailedAddress: "Tầng 3, Ngõ 105 Xuân Thủy",
    description: "Phòng gần các trường Đại học lớn, đầy đủ thiết bị gia dụng dùng chung bếp và phòng khách.",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600",
    structure: "WHOLE",
    floorArea: 75,
    mezzanineArea: 25,
    propertyId: "prop2",
    propertyName: "Dãy trọ sinh viên Thu Hương",
    propertyType: "COMPLEX",
    commonAmenities: [
      { name: "Chỗ để xe", compensationAmount: 0 },
      { name: "Máy giặt chung", compensationAmount: 0 }
    ],
    amenities: [
      { name: "WiFi", compensationAmount: 500000 },
      { name: "Điều hòa", compensationAmount: 1000000 },
      { name: "Máy giặt", compensationAmount: 1500000 },
      { name: "Tủ lạnh", compensationAmount: 2000000 },
      { name: "Bếp nấu", compensationAmount: 500000 }
    ]
  },
  {
    id: "p3_sub1",
    title: "Phòng trọ ghép tiện nghi cho sinh viên (Phòng B)",
    hostName: "Phạm Thu Hương",
    price: 1900000,
    priceFormatted: "1.900.000 đ/tháng",
    electricityPrice: 3500,
    waterPrice: 15000,
    address: "Cầu Giấy, Hà Nội",
    detailedAddress: "Tầng 3, Ngõ 105 Xuân Thủy",
    description: "Phòng trọ ghép chất lượng cao, thoáng mát nhiều ánh sáng.",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600",
    structure: "WHOLE",
    floorArea: 75,
    mezzanineArea: 25,
    propertyId: "prop2",
    propertyName: "Dãy trọ sinh viên Thu Hương",
    propertyType: "COMPLEX",
    commonAmenities: [
      { name: "Chỗ để xe", compensationAmount: 0 }
    ],
    amenities: [
      { name: "WiFi", compensationAmount: 500000 },
      { name: "Điều hòa", compensationAmount: 1000000 }
    ]
  }
];

const initialReportedData = [
  {
    id: "r1",
    title: "Chung cư mini view hồ Tây cực chill (P.502)",
    hostName: "Vũ Văn Thanh",
    price: 6000000,
    priceFormatted: "6.000.000 đ/tháng",
    electricityPrice: 3800,
    waterPrice: 20000,
    address: "Tây Hồ, Hà Nội",
    detailedAddress: "Phòng 502, Ngõ 12 Trích Sài",
    reports: [
      { reason: "Thông tin ảo" },
      { reason: "Thông tin ảo" },
      { reason: "Giá không đúng thực tế" },
      { reason: "Thông tin ảo" },
      { reason: "Thông tin ảo" },
      { reason: "Giá không đúng thực tế" },
      { reason: "Hình ảnh không trung thực" }
    ],
    description: "Căn hộ chung cư mini thực tế không có view hồ và diện tích nhỏ hơn nhiều so với hình ảnh quảng cáo.",
    imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600",
    structure: "APARTMENT",
    floorArea: 45,
    mezzanineArea: 0,
    propertyId: "prop3",
    propertyName: "Lakeview Apartment Tây Hồ",
    propertyType: "COMPLEX",
    commonAmenities: [
      { name: "Thang máy", compensationAmount: 0 },
      { name: "Bể bơi chung", compensationAmount: 0 },
      { name: "Sân thượng cafe", compensationAmount: 0 }
    ],
    amenities: [
      { name: "WiFi", compensationAmount: 500000 },
      { name: "Điều hòa", compensationAmount: 1000000 },
      { name: "Tủ lạnh lớn", compensationAmount: 2000000 }
    ]
  },
  {
    id: "r2",
    title: "Phòng trọ giá siêu rẻ sát đại học",
    hostName: "Hoàng Đức Duy",
    price: 1200000,
    priceFormatted: "1.200.000 đ/tháng",
    electricityPrice: 3500,
    waterPrice: 15000,
    address: "Thủ Đức, TP. Hồ Chí Minh",
    detailedAddress: "Đường số 8, Phường Linh Trung",
    reports: [
      { reason: "Lừa đảo tiền cọc" },
      { reason: "Lừa đảo tiền cọc" },
      { reason: "Không liên lạc được" }
    ],
    description: "Yêu cầu chuyển khoản đặt cọc giữ phòng trước khi đến xem, sau khi cọc thì chủ nhà khóa số điện thoại.",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600",
    structure: "SINGLE",
    floorArea: 15,
    mezzanineArea: 5,
    propertyId: null,
    propertyName: null,
    propertyType: "SINGLE",
    commonAmenities: [],
    amenities: [
      { name: "WiFi", compensationAmount: 500000 },
      { name: "Quạt điện", compensationAmount: 200000 }
    ]
  }
];

// Active Listings dataset (Currently approved listings on the platform)
const initialActiveData = [
  {
    id: "a1",
    title: "Căn hộ dịch vụ tiện ích khu trung tâm (P.302)",
    hostName: "Trần Quốc Bảo",
    price: 5200000,
    priceFormatted: "5.200.000 đ/tháng",
    electricityPrice: 3500,
    waterPrice: 15000,
    address: "Quận 3, TP. Hồ Chí Minh",
    detailedAddress: "Tầng 3 - Phòng 302, 123 Điện Biên Phủ",
    description: "Căn hộ dịch vụ cao cấp, đầy đủ nội thất, giờ giấc tự do, bảo vệ 24/7.",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600",
    structure: "APARTMENT",
    floorArea: 35,
    mezzanineArea: 0,
    propertyId: "prop1",
    propertyName: "Tòa nhà Quốc Bảo Luxury",
    propertyType: "COMPLEX",
    commonAmenities: [
      { name: "Thang máy", compensationAmount: 0 },
      { name: "Bảo vệ 24/7", compensationAmount: 0 }
    ],
    amenities: [
      { name: "WiFi", compensationAmount: 500000 },
      { name: "Điều hòa", compensationAmount: 1000000 }
    ],
    status: "ACTIVE"
  },
  {
    id: "a2",
    title: "Phòng trọ ban công thoáng mát Quận 10",
    hostName: "Đặng Hồng Nhung",
    price: 3500000,
    priceFormatted: "3.500.000 đ/tháng",
    electricityPrice: 3500,
    waterPrice: 15000,
    address: "Quận 10, TP. Hồ Chí Minh",
    detailedAddress: "Đường Cách Mạng Tháng 8",
    description: "Phòng trọ giá tốt, khu dân cư an ninh, yên tĩnh, sạch sẽ.",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600",
    structure: "SINGLE",
    floorArea: 22,
    mezzanineArea: 8,
    propertyId: null,
    propertyName: null,
    propertyType: "SINGLE",
    commonAmenities: [],
    amenities: [
      { name: "WiFi", compensationAmount: 500000 },
      { name: "Điều hòa", compensationAmount: 1000000 }
    ],
    status: "ACTIVE"
  }
];

// Enrichment mapper for Kotlin EzRoom Android models
const enrichRoomData = (room) => {
  const baseLat = room.propertyId === "prop1" ? 10.7291 : room.propertyId === "prop2" ? 21.0362 : 10.7626;
  const baseLng = room.propertyId === "prop1" ? 106.7022 : room.propertyId === "prop2" ? 105.7839 : 106.6601;

  // Generate realistic category categories based on index
  const fallbackImages = [
    { url: room.imageUrl, category: "Mặt tiền" },
    { url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600", category: "Phòng ngủ" },
    { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600", category: "WC" }
  ];

  return {
    ...room,
    latitude: room.latitude || baseLat + (Math.random() - 0.5) * 0.002,
    longitude: room.longitude || baseLng + (Math.random() - 0.5) * 0.002,
    images: room.images || fallbackImages,
    detailedAreas: room.detailedAreas || [
      { roomName: "Không gian chính", areaValue: Math.round(room.floorArea * 0.7 * 10) / 10 },
      { roomName: "Nhà vệ sinh khép kín", areaValue: Math.round(room.floorArea * 0.15 * 10) / 10 },
      { roomName: "Ban công rộng rãi", areaValue: Math.round(room.floorArea * 0.15 * 10) / 10 }
    ]
  };
};

function RoomModeration() {
  const [pendingData, setPendingData] = useState(() => initialPendingData.map(enrichRoomData));
  const [reportedData, setReportedData] = useState(() => initialReportedData.map(enrichRoomData));
  const [activeData, setActiveData] = useState(() => initialActiveData.map(enrichRoomData));
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalSource, setModalSource] = useState(""); // "pending", "reported", or "active"
  const [actionReason, setActionReason] = useState("");

  // Helper to aggregate and sort report reasons by frequency (most to least)
  const getSortedReasons = (reports) => {
    if (!reports || reports.length === 0) return [];
    const counts = {};
    reports.forEach((r) => {
      counts[r.reason] = (counts[r.reason] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count);
  };

  // Search query, structure, and property type filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [structureFilter, setStructureFilter] = useState("ALL");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("ALL");

  // Filter list dynamically by query search, structural and property config
  const getFilteredList = (list) => {
    return list.filter((item) => {
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.propertyName && item.propertyName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchStructure = structureFilter === "ALL" || item.structure === structureFilter;
      const matchPropertyType = propertyTypeFilter === "ALL" || item.propertyType === propertyTypeFilter;
      return matchSearch && matchStructure && matchPropertyType;
    });
  };

  const filteredPendingData = getFilteredList(pendingData);
  const filteredReportedData = getFilteredList(reportedData);
  const filteredActiveData = getFilteredList(activeData);

  // Open modal handler
  const handleOpenModal = (item, source) => {
    setSelectedItem(item);
    setModalSource(source);
    setActionReason("");
    setIsModalOpen(true);
  };

  // Close modal handler
  const handleCloseModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  // Approve a room by ID
  const approveRoomById = (roomId) => {
    const target = pendingData.find((item) => item.id === roomId);
    if (!target) return;
    setPendingData((prev) => prev.filter((item) => item.id !== roomId));
    setActiveData((prev) => [
      ...prev,
      { ...target, id: `a-${Date.now()}-${roomId}`, status: "ACTIVE" }
    ]);
    message.success(`Duyệt phòng "${target.title}" thành công!`);
  };

  // Reject a room by ID
  const rejectRoomById = (roomId, reason) => {
    const target = pendingData.find((item) => item.id === roomId);
    if (!target) return;
    if (!reason || !reason.trim()) {
      message.error("Vui lòng nhập lý do từ chối!");
      return;
    }
    setPendingData((prev) => prev.filter((item) => item.id !== roomId));
    message.success(`Từ chối phòng "${target.title}" thành công!`);
  };

  // Approve listing handler (Pending tab)
  const handleApprove = () => {
    if (!selectedItem) return;
    approveRoomById(selectedItem.id);
    handleCloseModal();
  };

  // Reject listing handler (Pending tab)
  const handleReject = () => {
    if (!selectedItem) return;
    if (!actionReason.trim()) {
      message.error("Vui lòng nhập lý do từ chối!");
      return;
    }
    rejectRoomById(selectedItem.id, actionReason);
    handleCloseModal();
  };

  // Keep listing handler (Reported tab)
  const handleKeep = () => {
    if (!selectedItem) return;
    setReportedData((prev) => prev.filter((item) => item.id !== selectedItem.id));
    message.success("Giữ lại phòng trọ thành công!");
    handleCloseModal();
  };

  // Take down listing handler (Reported tab)
  const handleTakeDown = () => {
    if (!selectedItem) return;
    if (!actionReason.trim()) {
      message.error("Vui lòng nhập lý do khóa phòng!");
      return;
    }
    setReportedData((prev) => prev.filter((item) => item.id !== selectedItem.id));
    message.success("Khóa phòng trọ vi phạm thành công!");
    handleCloseModal();
  };

  // Hide active listing handler
  const handleHideActive = () => {
    if (!selectedItem) return;
    setActiveData((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id ? { ...item, status: "HIDDEN" } : item
      )
    );
    message.success("Đã ẩn phòng trọ thành công!");
    handleCloseModal();
  };

  // Show active listing handler
  const handleShowActive = () => {
    if (!selectedItem) return;
    setActiveData((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id ? { ...item, status: "ACTIVE" } : item
      )
    );
    message.success("Đã mở hiển thị phòng trọ thành công!");
    handleCloseModal();
  };

  // Delete active listing handler
  const handleDeleteActive = () => {
    if (!selectedItem) return;
    setActiveData((prev) => prev.filter((item) => item.id !== selectedItem.id));
    message.success("Đã xóa phòng trọ khỏi hệ thống!");
    handleCloseModal();
  };

  // Columns definition for Pending tab
  const pendingColumns = [
    {
      title: "Tiêu đề phòng",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-semibold text-onBackgroundLight">{text}</span>,
    },
    {
      title: "Hình thức đăng",
      key: "propertyType",
      render: (_, record) => {
        if (record.propertyType === "COMPLEX") {
          return (
            <div className="flex flex-col text-left">
              <Tag color="cyan">Dãy trọ / Tòa nhà</Tag>
              <span className="text-[11px] text-onBackgroundLight/40 font-medium mt-1">
                {record.propertyName}
              </span>
            </div>
          );
        }
        return <Tag color="blue">Phòng lẻ</Tag>;
      },
    },
    {
      title: "Chủ trọ",
      dataIndex: "hostName",
      key: "hostName",
    },
    {
      title: "Giá thuê",
      dataIndex: "priceFormatted",
      key: "price",
    },
    {
      title: "Khu vực",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tác vụ",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => handleOpenModal(record, "pending")}
          className="text-techBluePrimary font-semibold hover:text-techBluePrimary/80 transition-all duration-300 text-sm hover:underline hover:scale-105 active:scale-95 inline-block"
        >
          Xem chi tiết
        </button>
      ),
    },
  ];

  // Columns definition for Active listings tab
  const activeColumns = [
    {
      title: "Tiêu đề phòng",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-semibold text-onBackgroundLight">{text}</span>,
    },
    {
      title: "Hình thức đăng",
      key: "propertyType",
      render: (_, record) => {
        if (record.propertyType === "COMPLEX") {
          return (
            <div className="flex flex-col text-left">
              <Tag color="cyan">Dãy trọ / Tòa nhà</Tag>
              <span className="text-[11px] text-onBackgroundLight/40 font-medium mt-1">
                {record.propertyName}
              </span>
            </div>
          );
        }
        return <Tag color="blue">Phòng lẻ</Tag>;
      },
    },
    {
      title: "Chủ trọ",
      dataIndex: "hostName",
      key: "hostName",
    },
    {
      title: "Giá thuê",
      dataIndex: "priceFormatted",
      key: "price",
    },
    {
      title: "Trạng thái hiển thị",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (status === "ACTIVE") {
          return <Tag color="green">Đang hiển thị</Tag>;
        }
        return <Tag color="orange">Đã ẩn (Admin)</Tag>;
      },
    },
    {
      title: "Tác vụ",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => handleOpenModal(record, "active")}
          className="text-techBluePrimary font-semibold hover:text-techBluePrimary/80 transition-all duration-300 text-sm hover:underline hover:scale-105 active:scale-95 inline-block"
        >
          Quản lý phòng trọ
        </button>
      ),
    },
  ];

  // Columns definition for Reported tab
  const reportedColumns = [
    {
      title: "Tiêu đề phòng",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-semibold text-onBackgroundLight">{text}</span>,
    },
    {
      title: "Hình thức đăng",
      key: "propertyType",
      render: (_, record) => {
        if (record.propertyType === "COMPLEX") {
          return (
            <div className="flex flex-col text-left">
              <Tag color="cyan">Dãy trọ / Tòa nhà</Tag>
              <span className="text-[11px] text-onBackgroundLight/40 font-medium mt-1">
                {record.propertyName}
              </span>
            </div>
          );
        }
        return <Tag color="blue">Phòng lẻ</Tag>;
      },
    },
    {
      title: "Chủ trọ",
      dataIndex: "hostName",
      key: "hostName",
    },
    {
      title: "Số lượt báo cáo",
      key: "reportCount",
      render: (_, record) => (
        <span className="font-semibold text-slate-700">
          {record.reports?.length || 0} lượt
        </span>
      ),
    },
    {
      title: "Lý do vi phạm chính",
      key: "reason",
      render: (_, record) => {
        const sorted = getSortedReasons(record.reports);
        return sorted.length > 0 ? (
          <span className="text-red-500 font-medium">{sorted[0].reason}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      title: "Tác vụ",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => handleOpenModal(record, "reported")}
          className="text-red-500 font-semibold hover:text-red-700 transition-all duration-300 text-sm hover:underline hover:scale-105 active:scale-95 inline-block"
        >
          Xử lý vi phạm
        </button>
      ),
    },
  ];

  // Tabs layout configuration
  const tabItems = [
    {
      key: "pendingTab",
      label: (
        <span className="flex items-center gap-2">
          Chờ kiểm duyệt
          <Badge
            count={filteredPendingData.length}
            style={{ backgroundColor: "#0284C7" }}
          />
        </span>
      ),
      children: (
        <Table
          dataSource={filteredPendingData}
          columns={pendingColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          className="custom-premium-table"
        />
      ),
    },
    {
      key: "activeTab",
      label: (
        <span className="flex items-center gap-2">
          Đang hiển thị / Đã duyệt
          <Badge
            count={filteredActiveData.length}
            style={{ backgroundColor: "#10B981" }}
          />
        </span>
      ),
      children: (
        <Table
          dataSource={filteredActiveData}
          columns={activeColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          className="custom-premium-table"
        />
      ),
    },
    {
      key: "reportedTab",
      label: (
        <span className="flex items-center gap-2">
          Bị báo cáo vi phạm
          <Badge
            count={filteredReportedData.length}
            style={{ backgroundColor: "#FF4D4F" }}
          />
        </span>
      ),
      children: (
        <Table
          dataSource={filteredReportedData}
          columns={reportedColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          className="custom-premium-table"
        />
      ),
    },
  ];

  return (
    // Moderation page wrapper
    <div className="double-bezel-outer animate-fade-in">
      <div className="double-bezel-inner p-6 bg-white/95 backdrop-blur-md">
        {/* Header section */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-onBackgroundLight tracking-wider uppercase">
            QUẢN LÝ KIỂM DUYỆT PHÒNG TRỌ
          </h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Phê duyệt phòng trọ mới, quản lý phòng trọ đang hoạt động và xử lý báo cáo vi phạm từ người thuê
          </p>
        </div>

        {/* Filtering toolbar in flex row */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
          {/* Search text query input */}
          <div className="flex-grow text-left">
            <Input
              prefix={<SearchOutlined className="text-slate-300" />}
              placeholder="Tìm theo tiêu đề, địa chỉ hoặc tên tòa nhà..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
            />
          </div>

          {/* Property type filter */}
          <div className="w-full md:w-56 text-left">
            <Select
              value={propertyTypeFilter}
              onChange={(value) => setPropertyTypeFilter(value)}
              options={[
                { value: "ALL", label: "Tất cả hình thức" },
                { value: "SINGLE", label: "Phòng lẻ" },
                { value: "COMPLEX", label: "Dãy trọ / Tòa nhà" }
              ]}
              className="w-full"
            />
          </div>

          {/* Structure type filter */}
          <div className="w-full md:w-56 text-left">
            <Select
              value={structureFilter}
              onChange={(value) => setStructureFilter(value)}
              options={[
                { value: "ALL", label: "Tất cả loại phòng" },
                { value: "SINGLE", label: "Phòng đơn (SINGLE)" },
                { value: "WHOLE", label: "Nguyên căn (WHOLE)" },
                { value: "APARTMENT", label: "Căn hộ (APARTMENT)" }
              ]}
              className="w-full"
            />
          </div>
        </div>

        {/* Active tabs wrapper */}
        <Tabs defaultActiveKey="pendingTab" items={tabItems} className="custom-tabs" />

        {/* Details review modal */}
        <Modal
          title={
            <span className="text-sm font-bold text-onBackgroundLight tracking-wider uppercase">
              {modalSource === "pending" && `KIỂM DUYỆT PHÒNG TRỌ`}
              {modalSource === "reported" && `XỬ LÝ VI PHẠM`}
              {modalSource === "active" && `QUẢN LÝ PHÒNG TRỌ ĐANG HIỂN THỊ`}
            </span>
          }
          open={isModalOpen}
          onCancel={handleCloseModal}
          width={750}
          footer={
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              {modalSource === "pending" && (
                <>
                  <button
                    onClick={handleReject}
                    className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-500 ease-premium text-xs font-bold tracking-widest uppercase active:scale-95 shadow-[0_2px_8px_rgba(239,68,68,0.15)]"
                  >
                    Từ chối
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-5 py-2.5 bg-techMintAccent hover:bg-techMintAccent/90 text-white font-bold rounded-xl transition-all duration-500 ease-premium text-xs tracking-widest uppercase active:scale-95 shadow-[0_2px_8px_rgba(16,185,129,0.15)]"
                  >
                    Duyệt phòng trọ
                  </button>
                </>
              )}
              
              {modalSource === "reported" && (
                <>
                  <button
                    onClick={handleKeep}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-500 ease-premium text-xs font-bold tracking-widest uppercase active:scale-95 border border-slate-200"
                  >
                    Giữ lại phòng trọ
                  </button>
                  <button
                    onClick={handleTakeDown}
                    className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all duration-500 ease-premium text-xs tracking-widest uppercase active:scale-95 shadow-[0_2px_8px_rgba(239,68,68,0.15)]"
                  >
                    Khóa phòng trọ ngay
                  </button>
                </>
              )}

              {modalSource === "active" && (
                <>
                  {selectedItem?.status === "ACTIVE" ? (
                    <button
                      onClick={handleHideActive}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all duration-500 ease-premium text-xs font-bold tracking-widest uppercase active:scale-95 shadow-[0_2px_8px_rgba(245,158,11,0.15)]"
                    >
                      Tạm ẩn bài
                    </button>
                  ) : (
                    <button
                      onClick={handleShowActive}
                      className="px-5 py-2.5 bg-techMintAccent hover:bg-techMintAccent/90 text-white rounded-xl transition-all duration-500 ease-premium text-xs font-bold tracking-widest uppercase active:scale-95 shadow-[0_2px_8px_rgba(16,185,129,0.15)]"
                    >
                      Mở hiển thị lại
                    </button>
                  )}
                  <button
                    onClick={handleDeleteActive}
                    className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all duration-500 ease-premium text-xs tracking-widest uppercase active:scale-95 shadow-[0_2px_8px_rgba(239,68,68,0.15)]"
                  >
                    Khóa phòng trọ ngay
                  </button>
                </>
              )}
            </div>
          }
        >
          {selectedItem && (
            <div className="space-y-5 mt-4 text-left max-h-[70vh] overflow-y-auto pr-2">
              {/* Room preview and details */}
              <div className="flex gap-4 items-start bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-32 h-24 object-cover rounded-xl bg-slate-200 flex-shrink-0 border border-slate-150 shadow-sm"
                />
                <div className="space-y-1">
                  <h4 className="font-bold text-onBackgroundLight text-sm leading-snug">{selectedItem.title}</h4>
                  <p className="text-xs text-slate-500">
                    <span className="font-semibold">Chủ trọ:</span> {selectedItem.hostName}
                  </p>
                  <p className="text-sm text-techBluePrimary font-extrabold">
                    {new Intl.NumberFormat("vi-VN").format(selectedItem.price)} đ / tháng
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    {selectedItem.detailedAddress}, {selectedItem.address}
                  </p>
                </div>
              </div>

              {/* Classified Image Gallery */}
              {selectedItem.images && selectedItem.images.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                    BỘ SƯU TẬP ẢNH THỰC TẾ (PHÂN LOẠI THEO DANH MỤC)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                    {selectedItem.images.map((img, idx) => (
                      <div key={idx} className="relative group overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-slate-100 aspect-[4/3] flex items-center justify-center">
                        <img
                          src={img.url}
                          alt={`Room view ${idx}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 text-[9px] font-extrabold tracking-wide uppercase bg-slate-900/70 text-white rounded-full backdrop-blur-sm shadow-md">
                          {img.category || "Chưa phân loại"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Parent Building / Property information */}
              {selectedItem.propertyType === "COMPLEX" && (
                <div className="bg-cyan-50/30 p-4 rounded-2xl border border-cyan-100/50 space-y-2">
                  <span className="text-[10px] font-bold text-cyan-600 uppercase block tracking-wider">
                    THÔNG TIN TÒA NHÀ / DÃY TRỌ CHỨA PHÒNG NÀY
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Tên Tòa nhà / Dãy trọ</span>
                      <span className="font-bold text-slate-700 block mt-1">{selectedItem.propertyName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Tiện ích chung tòa nhà</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {selectedItem.commonAmenities?.map((amenity, idx) => (
                          <span key={idx} className="inline-block px-2.5 py-0.5 text-[9px] font-bold tracking-wide uppercase bg-cyan-100/60 text-cyan-700 rounded-full">
                            {amenity.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sibling rooms in Complex */}
              {selectedItem.propertyType === "COMPLEX" && selectedItem.propertyId && modalSource === "pending" && (
                <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-bold text-cyan-600 uppercase block tracking-wider">
                      Danh sách các phòng chờ duyệt cùng Tòa nhà
                    </span>
                    <Badge
                      count={pendingData.filter((item) => item.propertyId === selectedItem.propertyId).length}
                      style={{ backgroundColor: "#0284C7" }}
                    />
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {pendingData
                      .filter((item) => item.propertyId === selectedItem.propertyId)
                      .map((room) => (
                        <div key={room.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm animate-fade-in">
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-slate-700">{room.title}</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                              Giá: {new Intl.NumberFormat("vi-VN").format(room.price)} đ/tháng | Diện tích: {room.floorArea}m²
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => approveRoomById(room.id)}
                              className="px-3 py-1 bg-techMintAccent hover:bg-techMintAccent/90 text-white text-[10px] font-bold tracking-wider uppercase rounded-lg active:scale-95 transition-all duration-300 border-none cursor-pointer"
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={() => {
                                if (!actionReason.trim()) {
                                  message.error("Vui lòng nhập lý do từ chối vào ô Ghi chú bên dưới trước!");
                                  return;
                                }
                                rejectRoomById(room.id, actionReason);
                              }}
                              className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold tracking-wider uppercase rounded-lg hover:bg-red-600 active:scale-95 transition-all duration-300 border-none cursor-pointer"
                            >
                              Từ chối
                            </button>
                          </div>
                        </div>
                      ))}
                    {pendingData.filter((item) => item.propertyId === selectedItem.propertyId).length === 0 && (
                      <span className="text-xs text-slate-400 font-medium block text-center py-2">
                        Đã duyệt hoặc từ chối hết tất cả phòng của tòa nhà này!
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Technical specifications grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">LOẠI HÌNH & DIỆN TÍCH</span>
                  <span className="text-xs font-bold text-slate-700 block mt-1">
                    {selectedItem.structure === "SINGLE" && "Phòng trọ truyền thống"}
                    {selectedItem.structure === "WHOLE" && "Nhà nguyên căn"}
                    {selectedItem.structure === "APARTMENT" && "Căn hộ dịch vụ/Studio"}
                    {` (Sàn: ${selectedItem.floorArea} m²${selectedItem.mezzanineArea > 0 ? ` + Gác: ${selectedItem.mezzanineArea} m²` : ""})`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">ĐƠN GIÁ ĐIỆN & NƯỚC MẶT ĐỊNH</span>
                  <span className="text-xs font-bold text-slate-700 block mt-1">
                    Điện: {new Intl.NumberFormat("vi-VN").format(selectedItem.electricityPrice)} đ/kWh | Nước: {new Intl.NumberFormat("vi-VN").format(selectedItem.waterPrice)} đ/m³
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">TỌA ĐỘ BẢN ĐỒ (GPS)</span>
                  <span className="text-xs font-bold text-slate-700 block mt-1">
                    Lat: {selectedItem.latitude?.toFixed(5)} | Lng: {selectedItem.longitude?.toFixed(5)}
                  </span>
                </div>
              </div>

              {/* Detailed areas breakdown */}
              {selectedItem.detailedAreas && selectedItem.detailedAreas.length > 0 && (
                <div className="space-y-1.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                    PHÂN RÃ DIỆN TÍCH CHI TIẾT
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                    {selectedItem.detailedAreas.map((area, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-slate-100 text-xs shadow-sm">
                        <span className="text-slate-400 block font-semibold">{area.roomName}</span>
                        <span className="font-extrabold text-slate-700 block mt-1 text-sm">{area.areaValue} m²</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GPS Google Maps ghim embed */}
              <div className="space-y-1.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                  VỊ TRÍ BẢN ĐỒ CHI TIẾT (GOOGLE MAPS PIN)
                </span>
                <iframe
                  title="Bản đồ vị trí phòng"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${selectedItem.latitude},${selectedItem.longitude}&z=15&output=embed`}
                  className="rounded-xl border border-slate-200 shadow-sm mt-2"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>

              {/* Amenities chips container */}
              <div className="space-y-1.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">TIỆN ÍCH TRONG PHÒNG & ĐỀN BÙ</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedItem.amenities?.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-techBluePrimary/10 text-techBluePrimary border border-techBluePrimary/5"
                    >
                      {amenity.name} {amenity.compensationAmount > 0 && `(Đền bù: ${new Intl.NumberFormat("vi-VN").format(amenity.compensationAmount)} đ)`}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">MÔ TẢ CHI TIẾT</span>
                <p className="text-xs leading-relaxed text-slate-600 bg-slate-50/30 p-3 rounded-2xl border border-slate-100 font-medium">
                  {selectedItem.description}
                </p>
              </div>

              {/* Report specific reason info */}
              {modalSource === "reported" && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">
                    LÝ DO BỊ BÁO CÁO ({selectedItem.reports?.length || 0} lượt báo cáo)
                  </span>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {getSortedReasons(selectedItem.reports).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-xs bg-red-50/50 p-3 rounded-xl border border-red-100 font-bold text-red-600 shadow-sm"
                      >
                        <span>{item.reason}</span>
                        <span className="text-[10px] bg-red-200/50 px-2.5 py-0.5 rounded-full text-red-700 font-bold">
                          {item.count} lượt
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin action reason input */}
              {(modalSource === "reported" || modalSource === "pending" || modalSource === "active") && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Lý do xử lý / Ghi chú gửi cho chủ nhà (Bắt buộc khi từ chối, tạm ẩn hoặc gỡ bài)
                  </label>
                  <Input.TextArea
                    rows={3}
                    placeholder="Nhập lý do chi tiết để hệ thống thông báo cho chủ nhà..."
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default RoomModeration;

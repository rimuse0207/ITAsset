// src/pages/Home/HelpDesk/HelpDeskData.js
export const initialHelpDeskList = [
  {
    id: "HD-2026-001",
    title: "개발본부 L3 스위치 포트 차단 장애",
    requester: "김철수 (개발본부)",
    category: "네트워크",
    priority: "긴급",
    status: "처리중",
    createdAt: "2026-06-05",
    swId: null, // 하드웨어/네트워크 이슈인 경우 null
    issueTag: "LOOPING_ERROR", // 🚀 동일 문제 추적용 핵심 식별 태그
    history: [
      {
        statusStr: "접수 완료",
        date: "2026-06-05 09:00",
        handler: "시스템",
        comment: "임직원 콘솔을 통해 장애 티켓이 자동 생성되었습니다.",
      },
      {
        statusStr: "담당자 지정",
        date: "2026-06-05 10:15",
        handler: "최관리자",
        comment: "인프라팀 최관리자 대리에게 티켓이 배정되었습니다.",
      },
    ],
    detail: {
      description:
        "개발 3팀 전원 특정 대역 내부망 접근 불가 현상 발생. L3 switch 24번 포트 루핑 의심됩니다.",
      rootCause:
        "협력사 직원이 개인 허브 장비를 임의로 업링크 포트에 혼용 배치하여 루핑 감지 및 포트 셧다운 유발.",
      resolution:
        "혼용 배치된 허브 장비 전면 철거 완료. L3 스위치 콘솔 접속 후 해당 포트 shutdown -> no shutdown 가동 싱크 복구 완료.",
    },
  },
  {
    id: "HD-2026-002",
    title: "Docker Desktop 볼륨 마운트 깨짐 및 라이선스 정품 인증 풀림 현상",
    requester: "최테크 (인프라팀)",
    category: "소프트웨어",
    priority: "보통",
    status: "대기중",
    createdAt: "2026-06-05",
    swId: "SW-003", // 🚀 IT 자산 관리의 Docker Desktop(SW-003) 자산과 유기적 링킹 완료!
    issueTag: "DOCKER_MOUNT_FAIL", // 🚀 추후 동일 컨테이너 장애 발생 시 지식베이스 자동 서치 태그
    history: [
      {
        statusStr: "접수 완료",
        date: "2026-06-05 14:20",
        handler: "시스템",
        comment: "사내 소프트웨어 가동 오류 제보 접수.",
      },
    ],
    detail: {
      description:
        "Docker 데스크탑 v4.29.0 업데이트 이후 로컬 컨테이너 볼륨 마운트가 해제되며 비즈니스 정품 인증 토큰 인식이 실패함.",
      rootCause: "",
      resolution: "",
    },
  },
  {
    id: "HD-2026-003",
    title: "Docker 데스크탑 구동 시 볼륨 마운트 권한 에러 건 (과거 이력)",
    requester: "박개발 (플랫폼팀)",
    category: "소프트웨어",
    priority: "보통",
    status: "완료",
    createdAt: "2026-04-12",
    swId: "SW-003", // 🚀 동일 S/W 관리 코드
    issueTag: "DOCKER_MOUNT_FAIL", // 🚀 동일한 이슈 태그 부여
    history: [
      {
        statusStr: "조치 완료",
        date: "2026-04-12 17:00",
        handler: "최관리자",
        comment: "로컬 보안 감사 폴더 권한 스크립트 재배포 후 정상 작동 판정.",
      },
    ],
    detail: {
      description:
        "M3 맥북 환경에서 도커 데스크탑 볼륨 연동 실패 및 권한 거부 에러 컴파일 차단 현상.",
      rootCause:
        "사내 보안 프로그램(DRM)의 실시간 감시 파일이 컨테이너 볼륨 가상 경로 권한을 임의 회수함.",
      resolution:
        "인프라 보안 관리 콘솔에서 해당 자산에 대한 Docker 격리 폴더 예외 처리 룰 적용 후 엔진 재시작 조치 완료.",
    },
  },
];

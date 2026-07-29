import {
  AlertCircle,
  X,
  Search,
  Laptop,
  User,
  Layers,
  Check,
  Users,
  Mail,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Select from "react-select";
import { SharedEditor } from "../Editor";
import UserSelectModal from "../../SoftWare/Modals/UserSelect/UserSelectModal";
import useSelectUser from "../../../../hooks/useSelectUser";

// 🚀 [서브 모달 1]: 소프트웨어 자산 다중 선택 (해시태그용)
const SoftwareMultiSelectModal = ({
  isOpen,
  onClose,
  selectedTags,
  onApply,
}) => {
  const softwareMasterList = [
    "Microsoft 365",
    "Docker Desktop",
    "AutoCAD",
    "Adobe Creative Cloud",
    "IntelliJ IDEA",
    "VS Code",
    "Slack",
    "Windows 11 OS",
    "macOS Sonoma",
  ];

  const [tempSelected, setTempSelected] = useState(selectedTags);

  React.useEffect(() => {
    if (isOpen) setTempSelected(selectedTags);
  }, [isOpen, selectedTags]);

  const handleToggle = (swName) => {
    setTempSelected((prev) =>
      prev.includes(swName)
        ? prev.filter((item) => item !== swName)
        : [...prev, swName],
    );
  };

  if (!isOpen) return null;

  return (
    <SubModalOverlay
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <SubModalContent onClick={(e) => e.stopPropagation()}>
        <SubHeader>
          <Layers size={16} color="#2563eb" />
          <span>관련 소프트웨어 자산 다중 선택 (해시태그)</span>
        </SubHeader>
        <SWListZone>
          {softwareMasterList.map((sw) => (
            <SWItem
              key={sw}
              onClick={() => handleToggle(sw)}
              isSelected={tempSelected.includes(sw)}
            >
              <input
                type="checkbox"
                checked={tempSelected.includes(sw)}
                readOnly
              />
              <span>{sw}</span>
            </SWItem>
          ))}
        </SWListZone>
        <SubFooter>
          <button type="button" className="cancel-btn" onClick={onClose}>
            취소
          </button>
          <button
            type="button"
            className="apply-btn"
            onClick={() => {
              onApply(tempSelected);
              onClose();
            }}
          >
            <Check size={14} /> 적용
          </button>
        </SubFooter>
      </SubModalContent>
    </SubModalOverlay>
  );
};

// 🚀 [서브 모달 2]: 참조자 추가 모달 (다중 선택 isMulti 적용)
const WatcherAddModal = ({ isOpen, onClose, onAdd, selectUserOption }) => {
  const [tab, setTab] = useState("INTERNAL");
  const [selectedInternals, setSelectedInternals] = useState([]); // 💡 다중 선택을 위해 배열([])로 초기화
  const [extName, setExtName] = useState("");
  const [extEmail, setExtEmail] = useState("");

  if (!isOpen) return null;

  const handleAdd = () => {
    if (tab === "INTERNAL") {
      if (!selectedInternals || selectedInternals.length === 0)
        return alert("사내 임직원을 선택해 주세요.");

      // 💡 선택된 여러 명의 임직원 데이터를 배열로 변환하여 부모에게 전달
      const newWatchers = selectedInternals.map((option) => ({
        type: "INTERNAL",
        name: option.label, // 이름 파싱
        email: option.value,
        code: option.value,
      }));

      onAdd(newWatchers);
      setSelectedInternals([]);
    } else {
      if (!extName.trim() || !extEmail.trim())
        return alert("외부 담당자의 이름과 이메일을 모두 입력해 주세요.");
      if (!/^\S+@\S+\.\S+$/.test(extEmail))
        return alert("유효한 이메일 형식이 아닙니다.");

      onAdd([
        {
          type: "EXTERNAL",
          name: extName.trim(),
          email: extEmail.trim(),
          code: `EXT-${Date.now()}`,
        },
      ]);
      setExtName("");
      setExtEmail("");
    }
    onClose();
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: "38px",
      borderRadius: "6px",
      borderColor: "#cbd5e1",
      fontSize: "13px",
      boxShadow: "none",
      "&:hover": { borderColor: "#2563eb" },
    }),
    menu: (base) => ({ ...base, zIndex: 999999 }),
    menuPortal: (base) => ({ ...base, zIndex: 999999 }),
  };

  return (
    <SubModalOverlay
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <SubModalContent onClick={(e) => e.stopPropagation()}>
        <SubHeader>
          <Users size={16} color="#2563eb" />
          <span>이슈 공유 대상 참조자 추가</span>
        </SubHeader>

        <TabContainer>
          <TabButton
            $active={tab === "INTERNAL"}
            type="button"
            onClick={() => setTab("INTERNAL")}
          >
            사내 임직원
          </TabButton>
          <TabButton
            $active={tab === "EXTERNAL"}
            type="button"
            onClick={() => setTab("EXTERNAL")}
          >
            외부 협력사
          </TabButton>
        </TabContainer>

        <TabContentZone>
          {tab === "INTERNAL" ? (
            <FormGroup>
              <label>사내 임직원 다중 검색</label>
              <Select
                isMulti // 💡 react-select 다중 선택 활성화
                options={selectUserOption}
                styles={selectStyles}
                placeholder="사원명 또는 사번 검색 (여러 명 선택 가능)..."
                isClearable
                value={selectedInternals}
                onChange={setSelectedInternals}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </FormGroup>
          ) : (
            <>
              <FormGroup>
                <label>외부 유지보수 담당자명</label>
                <input
                  type="text"
                  placeholder="예: DISCO 이민정 씨"
                  value={extName}
                  onChange={(e) => setExtName(e.target.value)}
                />
              </FormGroup>
              <FormGroup style={{ marginTop: "12px" }}>
                <label>수신 이메일 주소</label>
                <input
                  type="email"
                  placeholder="알림을 수신할 이메일 입력"
                  value={extEmail}
                  onChange={(e) => setExtEmail(e.target.value)}
                />
              </FormGroup>
            </>
          )}
        </TabContentZone>

        <SubFooter>
          <button type="button" className="cancel-btn" onClick={onClose}>
            취소
          </button>
          <button type="button" className="apply-btn" onClick={handleAdd}>
            <Check size={14} /> 목록에 추가
          </button>
        </SubFooter>
      </SubModalContent>
    </SubModalOverlay>
  );
};

// 🚀 [메인 모달]: 이슈 티켓 생성 폼
const CreateTicketModal = ({ isOpen, onClose, onCreate }) => {
  const { selectUserOption } = useSelectUser();
  const [selectedUser, setSelectedUser] = useState(null);

  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [isSoftwarePickerOpen, setIsSoftwarePickerOpen] = useState(false);
  const [isWatcherPickerOpen, setIsWatcherPickerOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    priority: "보통",
    linkedAsset: "",
    createdAt: new Date().toISOString().split("T")[0],
    hashTags: [],
    watchers: [],
  });

  const [content, setContent] = useState("");

  if (!isOpen) return null;

  const handleCloseConfirm = () => {
    if (
      window.confirm(
        "작성 중인 내용이 저장되지 않았습니다.\n정말 모달창을 닫으시겠습니까?",
      )
    ) {
      setFormData({
        title: "",
        priority: "보통",
        linkedAsset: "",
        createdAt: new Date().toISOString().split("T")[0],
        hashTags: [],
        watchers: [],
      });
      setContent("");
      setSelectedUser(null);
      onClose();
    }
  };

  const handleChange = (e, selectInput = "select") => {
    console.log(e);
    if (selectInput === "select") {
      const { name, value, label } = e.target;
      setFormData((prev) => ({ ...prev, [name]: label, [value]: value }));
    } else {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUserChange = (option) => {
    setSelectedUser(option);
    setFormData((prev) => ({ ...prev, linkedAsset: "" }));
  };

  // 💡 다중 선택된 배열 데이터를 받아 중복을 검사하고 일괄 병합하는 핸들러
  const handleAddWatchers = (newWatchersArray) => {
    setFormData((prev) => {
      const currentWatchers = [...prev.watchers];
      let duplicateCount = 0;

      newWatchersArray.forEach((newWatcher) => {
        if (currentWatchers.find((w) => w.email === newWatcher.code)) {
          duplicateCount++;
        } else {
          currentWatchers.push(newWatcher);
        }
      });

      if (duplicateCount > 0) {
        alert(
          `이미 등록된 ${duplicateCount}명을 제외하고 성공적으로 추가되었습니다.`,
        );
      }

      return { ...prev, watchers: currentWatchers };
    });
  };

  const handleRemoveWatcher = (codeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      watchers: prev.watchers.filter((w) => w.code !== codeToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedUser) {
      alert("이슈 대상 임직원과 H/W 자산을 먼저 선택해 주세요.");
      return;
    }

    const newTicket = {
      id: `TK-2026-${Math.floor(Math.random() * 900) + 100}`,
      title: formData.title,
      category: "하드웨어 자산",
      linkedAsset: formData.linkedAsset,
      priority: formData.priority,
      status: "대기중",
      createdAt: formData.createdAt,
      hashTags: formData.hashTags.length > 0 ? formData.hashTags : ["미분류"],
      watchers: formData.watchers,
      errorImg: null,
      description: content,
      solutions: [],
      selectedUser,
    };

    onCreate(newTicket);
    setFormData({
      title: "",
      priority: "보통",
      linkedAsset: "",
      createdAt: new Date().toISOString().split("T")[0],
      hashTags: [],
      watchers: [],
    });
    setContent("");
    setSelectedUser(null);
    onClose();
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: "38px",
      borderRadius: "6px",
      borderColor: "#cbd5e1",
      fontSize: "13px",
      boxShadow: "none",
      "&:hover": { borderColor: "#2563eb" },
      zIndex: "99",
    }),
    menu: (base) => ({ ...base, zIndex: 999999 }),
    menuPortal: (base) => ({ ...base, zIndex: 999999 }),
  };

  return (
    <ModalOverlay>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div className="title-area">
            <AlertCircle size={18} color="#2563eb" />
            <h2>신규 헬프데스크 이슈 등록</h2>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={handleCloseConfirm}
          >
            <X size={18} />
          </button>
        </ModalHeader>

        <ModalBodyForm onSubmit={handleSubmit}>
          <FormGrid>
            <FormGroup className="full-width">
              <label>
                이슈 제목 <span className="req">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={(e) => handleChange(e, "text")}
                placeholder="발생한 장애 및 이슈의 핵심 제목을 입력하세요."
              />
            </FormGroup>

            <FormGroup>
              <label>
                장애 발생 임직원 <span className="req">*</span>
              </label>
              <Select
                options={selectUserOption}
                styles={selectStyles}
                placeholder="사원명 검색..."
                isClearable
                value={selectedUser}
                onChange={handleUserChange}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </FormGroup>

            <FormGroup>
              <label>대상 H/W 자산</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder={
                    selectedUser ? "클릭하여 자산 선택" : "사용자 선행 필수"
                  }
                  value={formData.linkedAsset}
                  onClick={() => {
                    if (!selectedUser)
                      return alert("장애 발생 임직원을 먼저 선택해 주세요.");
                    setIsAssetPickerOpen(true);
                  }}
                  style={{
                    cursor: selectedUser ? "pointer" : "not-allowed",
                    paddingRight: "30px",
                    background: selectedUser ? "#fff" : "#f1f5f9",
                  }}
                />
                <SearchIconBtn type="button">
                  <Search size={14} />
                </SearchIconBtn>
              </div>
            </FormGroup>

            <FormGroup>
              <label>
                발생 일자 <span className="req">*</span>
              </label>
              <input
                type="date"
                name="createdAt"
                required
                value={formData.createdAt}
                onChange={(e) => handleChange(e, "text")}
              />
            </FormGroup>

            <FormGroup>
              <label>
                우선순위 <span className="req">*</span>
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="긴급">긴급 (즉시 조치 요망)</option>
                <option value="보통">보통 (일반 정비)</option>
                <option value="낮음">낮음 (단순 문의/개선)</option>
              </select>
            </FormGroup>

            <FormGroup className="full-width">
              <label>
                관련 S/W 자산 해시태그 <span className="req">*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  readOnly
                  placeholder="클릭하여 관련된 소프트웨어 자산을 선택하세요."
                  value={formData.hashTags.map((t) => `#${t}`).join(", ")}
                  onClick={() => setIsSoftwarePickerOpen(true)}
                  style={{
                    cursor: "pointer",
                    paddingRight: "30px",
                    color: "#2563eb",
                    fontWeight: "600",
                  }}
                />
                <SearchIconBtn type="button">
                  <Layers size={14} />
                </SearchIconBtn>
              </div>
            </FormGroup>

            <FormGroup className="full-width">
              <label>
                상세 설명 및 증상 <span className="req">*</span>
              </label>
            </FormGroup>
            <FormGroup
              className="full-width"
              onClick={(e) => {
                if (e.target.closest("button")) {
                  e.preventDefault();
                }
              }}
            >
              <SharedEditor value={content} onChange={setContent} />
            </FormGroup>
          </FormGrid>

          <ModalFooter>
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCloseConfirm}
            >
              취소
            </button>
            <button type="submit" className="btn-submit">
              이슈 티켓 등록
            </button>
          </ModalFooter>
        </ModalBodyForm>
      </ModalContent>

      <UserSelectModal
        isOpen={isAssetPickerOpen}
        onClose={() => setIsAssetPickerOpen(false)}
        userCode={selectedUser?.value}
        userName={selectedUser?.label?.split(" ")[0]}
        onSelect={(id) => setFormData((prev) => ({ ...prev, linkedAsset: id }))}
      />

      <SoftwareMultiSelectModal
        isOpen={isSoftwarePickerOpen}
        onClose={() => setIsSoftwarePickerOpen(false)}
        selectedTags={formData.hashTags}
        onApply={(tags) => setFormData((prev) => ({ ...prev, hashTags: tags }))}
      />

      {/* 🚀 서브 모달 3: 참조자 일괄 추가 마운트 */}
      <WatcherAddModal
        isOpen={isWatcherPickerOpen}
        onClose={() => setIsWatcherPickerOpen(false)}
        onAdd={handleAddWatchers} // 배열 데이터를 받는 핸들러로 매핑
        selectUserOption={selectUserOption}
      />
    </ModalOverlay>
  );
};

export default CreateTicketModal;

/* ─── 🎨 참조자(Watchers) 관련 신규 스타일 컴포넌트 ─── */
const AddWatcherBtn = styled.button`
  background: none;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
    color: #0f172a;
  }
`;
const WatcherChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 40px;
  padding: 10px;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  background: #f8fafc;
  .empty-msg {
    font-size: 11.5px;
    color: #94a3b8;
    font-weight: 500;
    display: flex;
    align-items: center;
  }
`;
const WatcherChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px; /* 내부 요소 간격 살짝 넓힘 */
  padding: 6px 10px; /* 위아래 텍스트가 들어가므로 패딩 여유 추가 */
  border-radius: 6px;
  background: ${(props) => (props.$isExternal ? "#fff7ed" : "#eff6ff")};
  border: 1px solid ${(props) => (props.$isExternal ? "#fed7aa" : "#bfdbfe")};

  .w-type {
    font-size: 10px;
    font-weight: 800;
    white-space: nowrap;
    color: ${(props) => (props.$isExternal ? "#ea580c" : "#2563eb")};
  }

  /* 🚀 이름과 이메일을 위아래로 묶어주는 컨테이너 */
  .w-info {
    display: flex;
    flex-direction: column;
    gap: 3px; /* 이름과 이메일 사이의 미세한 간격 */
  }

  .w-name {
    font-size: 12px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1;
  }

  /* 🚀 추가된 이메일 텍스트 스타일 */
  .w-email {
    font-size: 10.5px;
    font-weight: 500;
    color: #64748b;
    line-height: 1;
  }

  button {
    background: none;
    border: none;
    padding: 0;
    margin-left: 4px;
    color: #94a3b8;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: color 0.15s;
    &:hover {
      color: #ef4444;
    }
  }
`;
const TabContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 8px;
`;
const TabButton = styled.button`
  flex: 1;
  padding: 8px 0;
  font-size: 13px;
  font-weight: 700;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: ${(props) => (props.$active ? "#2563eb" : "#64748b")};
  background: ${(props) => (props.$active ? "#eff6ff" : "transparent")};
  &:hover {
    background: ${(props) => (props.$active ? "#eff6ff" : "#f1f5f9")};
  }
`;
const TabContentZone = styled.div`
  min-height: 120px;
`;

/* ─── 🎨 기존 스타일 모음 ─── */
const SearchIconBtn = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  pointer-events: none;
`;
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.4);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ModalContent = styled.div`
  background: #ffffff;
  width: 60%;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  .title-area {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  h2 {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
  .close-btn {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    &:hover {
      color: #0f172a;
    }
  }
`;
const ModalBodyForm = styled.form`
  display: flex;
  flex-direction: column;
`;
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 20px 24px;
  max-height: 70vh;
  overflow-y: auto;
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  &.full-width {
    grid-column: 1 / -1;
  }
  label {
    font-size: 12px;
    font-weight: 700;
    color: #475569;
    .req {
      color: #ef4444;
    }
  }
  input,
  select {
    padding: 10px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 13px;
    outline: none;
    background: #fff;
    color: #334155;
    width: 100%;
    box-sizing: border-box;
    &:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
    }
  }
`;
const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  button {
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
  }
  .btn-cancel {
    background: #fff;
    border: 1px solid #cbd5e1;
    color: #475569;
    &:hover {
      background: #f1f5f9;
    }
  }
  .btn-submit {
    background: #2563eb;
    border: 1px solid #2563eb;
    color: #fff;
    &:hover {
      background: #1d4ed8;
    }
  }
`;
const SubModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SubModalContent = styled.div`
  background: #fff;
  width: 340px;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
`;
const SubHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 14px;
  color: #1e293b;
  margin-bottom: 16px;
`;
const SWListZone = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 240px;
  overflow-y: auto;
  padding-right: 4px;
`;
const SWItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid ${(props) => (props.isSelected ? "#2563eb" : "#e2e8f0")};
  background: ${(props) => (props.isSelected ? "#eff6ff" : "#f8fafc")};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  span {
    font-size: 12.5px;
    font-weight: 600;
    color: ${(props) => (props.isSelected ? "#1e40af" : "#475569")};
  }
  &:hover {
    border-color: #2563eb;
  }
`;
const SubFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  button {
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .cancel-btn {
    background: #f1f5f9;
    border: none;
    color: #475569;
    &:hover {
      background: #e2e8f0;
    }
  }
  .apply-btn {
    background: #2563eb;
    border: none;
    color: #fff;
    &:hover {
      background: #1d4ed8;
    }
  }
`;

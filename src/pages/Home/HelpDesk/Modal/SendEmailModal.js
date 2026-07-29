import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Select from "react-select";
import { X, Mail, Check, Users, Send } from "lucide-react";
import { SharedEditor } from "../Editor"; // 경로에 맞게 수정해주세요
import { Request_Post_Axios } from "../../../../API";

// 🚀 [서브 모달]: 수신자(참조자) 추가 모달
const WatcherAddModal = ({ isOpen, onClose, onAdd, selectUserOption }) => {
  const [tab, setTab] = useState("INTERNAL");
  const [selectedInternals, setSelectedInternals] = useState([]);
  const [extName, setExtName] = useState("");
  const [extEmail, setExtEmail] = useState("");

  if (!isOpen) return null;

  const handleAdd = () => {
    if (tab === "INTERNAL") {
      if (!selectedInternals || selectedInternals.length === 0)
        return alert("사내 임직원을 선택해 주세요.");

      const newWatchers = selectedInternals.map((option) => ({
        type: "INTERNAL",
        name: option.label.split(" ")[0],
        email: option.email || option.value, // value나 email 속성 사용
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
          <span>메일 수신자 추가</span>
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
                isMulti
                options={selectUserOption}
                styles={selectStyles}
                placeholder="사원명 또는 사번 검색..."
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
                  placeholder="예: 외부업체 A씨"
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

const SendEmailModal = ({ isOpen, onClose, ticket, selectUserOption }) => {
  const [isWatcherPickerOpen, setIsWatcherPickerOpen] = useState(false);
  const [watchers, setWatchers] = useState([]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (isOpen && ticket) {
      // 모달이 열릴 때 선택된 티켓 정보를 바탕으로 메일 제목 기본값 세팅
      setSubject(`[IT 헬프데스크] ${ticket.id} - 진행 상황 공유 건`);
    }
  }, [isOpen, ticket]);

  if (!isOpen) return null;

  const handleAddWatchers = (newWatchersArray) => {
    setWatchers((prev) => {
      const current = [...prev];
      let duplicateCount = 0;
      newWatchersArray.forEach((newW) => {
        if (current.find((w) => w.email === newW.email || w.code === newW.code))
          duplicateCount++;
        else current.push(newW);
      });
      if (duplicateCount > 0)
        alert(`이미 등록된 ${duplicateCount}명을 제외하고 추가되었습니다.`);
      return current;
    });
  };

  const handleRemoveWatcher = (codeToRemove) => {
    setWatchers((prev) => prev.filter((w) => w.code !== codeToRemove));
  };

  const handleSendEmail = async () => {
    if (watchers.length === 0)
      return alert("수신자를 최소 1명 이상 등록해 주세요.");
    if (!subject.trim()) return alert("메일 제목을 입력해 주세요.");

    if (
      window.confirm(
        `${watchers.length}명의 수신자에게 메일을 발송하시겠습니까?`,
      )
    ) {
      const request = await Request_Post_Axios("/HelpDesk/sendingMail", {
        ticketId: ticket.id,
        watchers,
        subject,
        content,
      });
      console.log("발송 데이터:", {
        ticketId: ticket.id,
        watchers,
        subject,
        content,
      });
      alert("메일이 성공적으로 발송되었습니다.");
      // 🌐 추후 메일 발송 API 연동 부분
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div className="title-area">
            <Mail size={18} color="#2563eb" />
            <h2>이슈 진행 상황 메일 공유</h2>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </ModalHeader>

        <ModalBody>
          {/* 1. 수신자 지정 영역 */}
          <FormGroup>
            <label
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                수신자 (참조자) <span className="req">*</span>
              </span>
              <AddWatcherBtn
                type="button"
                onClick={() => setIsWatcherPickerOpen(true)}
              >
                + 수신자 추가
              </AddWatcherBtn>
            </label>
            <WatcherChipsContainer>
              {watchers.length === 0 ? (
                <span className="empty-msg">
                  메일을 수신할 사내/사외 담당자를 추가하세요.
                </span>
              ) : (
                watchers.map((w) => (
                  <WatcherChip key={w.code} $isExternal={w.type === "EXTERNAL"}>
                    <span className="w-type">
                      {w.type === "EXTERNAL" ? "외부" : "사내"}
                    </span>
                    <div className="w-info">
                      <span className="w-name">{w.name}</span>
                      <span className="w-email">{w.email}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveWatcher(w.code)}
                    >
                      <X size={12} />
                    </button>
                  </WatcherChip>
                ))
              )}
            </WatcherChipsContainer>
          </FormGroup>

          {/* 2. 메일 제목 영역 */}
          <FormGroup style={{ marginTop: "16px" }}>
            <label>
              메일 제목 <span className="req">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="메일 제목을 입력하세요."
            />
          </FormGroup>

          {/* 3. 에디터 영역 */}
          <FormGroup
            style={{
              marginTop: "16px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label>
              메일 내용 <span className="req">*</span>
            </label>
            <div style={{ flex: 1, minHeight: "300px" }}>
              <SharedEditor
                value={content}
                onChange={setContent}
                height="100%"
              />
            </div>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <button type="button" className="btn-cancel" onClick={onClose}>
            취소
          </button>
          <button
            type="button"
            className="btn-submit"
            onClick={handleSendEmail}
          >
            <Send size={14} style={{ marginRight: "4px" }} /> 메일 전송
          </button>
        </ModalFooter>
      </ModalContent>

      <WatcherAddModal
        isOpen={isWatcherPickerOpen}
        onClose={() => setIsWatcherPickerOpen(false)}
        onAdd={handleAddWatchers}
        selectUserOption={selectUserOption}
      />
    </ModalOverlay>
  );
};

export default SendEmailModal;

/* ─── 🎨 스타일 컴포넌트 ─── */
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
  width: 700px;
  max-height: 90vh;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
const ModalBody = styled.div`
  padding: 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  flex: 1;
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  label {
    font-size: 12px;
    font-weight: 700;
    color: #475569;
    .req {
      color: #ef4444;
    }
  }
  input {
    padding: 10px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 13px;
    outline: none;
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
    display: flex;
    align-items: center;
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

const AddWatcherBtn = styled.button`
  background: none;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 4px 8px;
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
  min-height: 48px;
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
  gap: 10px;
  padding: 6px 10px;
  border-radius: 6px;
  background: ${(props) => (props.$isExternal ? "#fff7ed" : "#eff6ff")};
  border: 1px solid ${(props) => (props.$isExternal ? "#fed7aa" : "#bfdbfe")};
  .w-type {
    font-size: 10px;
    font-weight: 800;
    white-space: nowrap;
    color: ${(props) => (props.$isExternal ? "#ea580c" : "#2563eb")};
  }
  .w-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .w-name {
    font-size: 12px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1;
  }
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
    &:hover {
      color: #ef4444;
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

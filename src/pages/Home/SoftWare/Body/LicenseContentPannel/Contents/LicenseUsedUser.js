import { Edit3, Plus, Trash2, User } from "lucide-react";
import React from "react";
import {
  SectionAddButton,
  SectionBlock,
  SectionHeaderZone,
  SectionTitle,
  TableActionButton,
  UserTableContainer,
} from "../LicenseContentPannel";
import { TableActionFlexZone, UserTable } from "./LicensePurchaseHistory";
import { theme } from "../../../../Style/MainStyle";
import moment from "moment";

const LicenseUsedUser = ({ selectedVersion, onAction }) => {
  return (
    <SectionBlock style={{ marginBottom: 0 }}>
      <SectionHeaderZone>
        <SectionTitle>
          <User size={15} /> 현재 실사용 임직원 테이블 매핑 뷰 (
          {selectedVersion.users?.length || 0}명 할당)
        </SectionTitle>
        <SectionAddButton
          onClick={() => onAction && onAction("REGISTER", "USER")}
        >
          <Plus size={12} /> 실사용자 라이선스 등록
        </SectionAddButton>
      </SectionHeaderZone>

      <UserTableContainer>
        <UserTable>
          <thead>
            <tr>
              <th>실사용 임직원</th>
              <th>부서</th>
              <th>지급 디바이스 자산코드</th>
              <th>라이선스 지급일</th>
              <th style={{ width: "80px", textAlign: "center" }}>등록 제어</th>
            </tr>
          </thead>
          <tbody>
            {!selectedVersion.users || selectedVersion.users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    color: theme.colors.textMuted,
                    padding: "32px",
                  }}
                >
                  현재 이 버전을 할당받아 구동 중인 임직원이 없습니다.
                </td>
              </tr>
            ) : (
              selectedVersion.users.map((user, uIdx) => (
                <tr key={uIdx}>
                  <td className="user-name">
                    <User size={12} className="table-u-icon" /> {user.fullName}{" "}
                    {user.titleName}
                  </td>
                  <td>{user.departmentName}</td>
                  <td className="asset-code">{user.assetId}</td>
                  <td>{moment(user.assignedDate).format("YY.MM.DD")}</td>
                  <td>
                    <TableActionFlexZone>
                      <TableActionButton
                        title="할당 정보 변경"
                        onClick={() => onAction("EDIT", "USER", user)}
                      >
                        <Edit3 size={12} />
                      </TableActionButton>
                      <TableActionButton
                        title="라이선스 회수/만료"
                        className="danger"
                        onClick={() =>
                          onAction("DELETE", "USER", user, selectedVersion)
                        }
                      >
                        <Trash2 size={12} />
                      </TableActionButton>
                    </TableActionFlexZone>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </UserTable>
      </UserTableContainer>
    </SectionBlock>
  );
};

export default LicenseUsedUser;

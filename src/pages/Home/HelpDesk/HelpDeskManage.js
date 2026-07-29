import React, { useEffect, useState } from "react";
import styled from "styled-components";
import MainSidebar from "../../SideBar/MainSideBar";
import HelpDeskLists from "./Content/List/HelpDeskLists";

import CreateTicketModal from "./Modal/CreateTicketModal";
import { Request_Get_Axios, Request_Post_Axios } from "../../../API";

import SendEmailModal from "./Modal/SendEmailModal";
import useSelectUser from "../../../hooks/useSelectUser";
import HelpDeskMainContent from "./Content/MainContent/HelpDeskMainContent";

export default function HelpDeskManage() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("전체");

  const { selectUserOption } = useSelectUser();

  useEffect(() => {
    getTicketLists();
  }, []);

  const getTicketLists = async () => {
    const request = await Request_Get_Axios(`/HelpDesk/getTicketList`);

    setTickets(request.data);
  };

  const handleCreateNewTicket = (newTicket) => {
    const request = Request_Post_Axios(`/HelpDesk/makeNewTicket`, {
      newTicket,
    });

    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);
    setSelectedTicket(newTicket);
  };

  return (
    <Container>
      <MainSidebar currentMenu={"helpdesk"} />
      <HelpDeskLists
        tickets={tickets}
        currentTab={currentTab}
        searchQuery={searchQuery}
        selectedTicket={selectedTicket}
        setSearchQuery={setSearchQuery}
        setCurrentTab={setCurrentTab}
        setIsCreateModalOpen={setIsCreateModalOpen}
        setSelectedTicket={setSelectedTicket}
      ></HelpDeskLists>

      <HelpDeskMainContent
        tickets={tickets}
        selectedTicket={selectedTicket}
        setTickets={setTickets}
        setSelectedTicket={setSelectedTicket}
        setIsEmailModalOpen={setIsEmailModalOpen}
      ></HelpDeskMainContent>

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateNewTicket}
      />
      <SendEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        ticket={selectedTicket}
        selectUserOption={selectUserOption}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  background-color: #f8fafc;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

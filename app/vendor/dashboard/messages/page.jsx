"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Image as ImageIcon,
  Send,
  ArrowLeft,
} from "lucide-react";
import {
  useConversations,
  useMessages,
  useSendMessage,
} from "@/hooks/use-messages";
import { mockQuickReplies } from "@/lib/mock/messages";

export default function MessagesPage() {
  const [filters, setFilters] = useState({
    filter: "active",
    search: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [activeConversation, setActiveConversation] = useState(1);
  const [messageInput, setMessageInput] = useState("");
  const [showChat, setShowChat] = useState(false); // Mobile view toggle

  const { data: conversationsData } = useConversations(filters);
  const { data: messages } = useMessages(activeConversation);
  const sendMessage = useSendMessage();

  const handleSearch = (value) => {
    setSearchInput(value);
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleFilterChange = (filter) => {
    setFilters((prev) => ({ ...prev, filter }));
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage.mutate({
        conversationId: activeConversation,
        message: messageInput.trim(),
      });
      setMessageInput("");
    }
  };

  const handleQuickReply = (reply) => {
    setMessageInput(reply);
  };

  const handleSelectConversation = (id) => {
    setActiveConversation(id);
    setShowChat(true); // Show chat on mobile when conversation selected
  };

  const handleBackToList = () => {
    setShowChat(false);
  };

  const activeConv = conversationsData?.conversations?.find(
    (c) => c.id === activeConversation,
  );

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col bg-[#F8FAFC]">
      {/* Page Header - Above everything */}
      <div className="px-4 md:px-6 py-4 md:py-6 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          {/* Mobile back button */}
          {showChat && (
            <button
              onClick={handleBackToList}
              className="md:hidden p-2 -ml-2 text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="font-manrope text-[20px] md:text-[24px] font-bold text-[#1E293B] mb-1 truncate">
              Message Center
            </h1>
            <p className="font-manrope text-[12px] md:text-[13px] text-[#64748B] hidden sm:block">
              View all your conversations and updates in one place, with
              everything you need to stay informed and connected.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Two Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Conversations List */}
        <div
          className={`
          w-full md:w-[340px] bg-white border-r border-[#E5E7EB] flex flex-col
          ${showChat ? "hidden md:flex" : "flex"}
        `}
        >
          {/* Search */}
          <div className="p-4 border-b border-[#E5E7EB]">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                size={18}
              />
              <input
                type="text"
                placeholder="Search name, ID or phone..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 px-4 py-3 border-b border-[#E5E7EB] overflow-x-auto">
            <button
              onClick={() => handleFilterChange("active")}
              className={`
                px-4 py-1.5 rounded-lg font-manrope text-[13px] font-medium transition-colors whitespace-nowrap flex-shrink-0
                ${
                  filters.filter === "active"
                    ? "bg-[#1E293B] text-white"
                    : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9]"
                }
              `}
            >
              Active ({conversationsData?.counts?.active || 0})
            </button>
            <button
              onClick={() => handleFilterChange("pending")}
              className={`
                px-4 py-1.5 rounded-lg font-manrope text-[13px] font-medium transition-colors whitespace-nowrap flex-shrink-0
                ${
                  filters.filter === "pending"
                    ? "bg-[#1E293B] text-white"
                    : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9]"
                }
              `}
            >
              Pending ({conversationsData?.counts?.pending || 0})
            </button>
            <button
              onClick={() => handleFilterChange("closed")}
              className={`
                px-4 py-1.5 rounded-lg font-manrope text-[13px] font-medium transition-colors whitespace-nowrap flex-shrink-0
                ${
                  filters.filter === "closed"
                    ? "bg-[#1E293B] text-white"
                    : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9]"
                }
              `}
            >
              Closed
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
            {conversationsData?.conversations?.map((conversation, index) => (
              <motion.button
                key={conversation.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelectConversation(conversation.id)}
                className={`
                  w-full p-4 flex items-start gap-3 border-b border-[#E5E7EB] transition-colors text-left
                  ${
                    activeConversation === conversation.id
                      ? "bg-[#F8FAFC]"
                      : "hover:bg-[#F8FAFC]"
                  }
                `}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-manrope text-[14px] font-bold"
                    style={{
                      backgroundColor: conversation.contactColor + "20",
                      color: conversation.contactColor,
                    }}
                  >
                    {conversation.contactInitials}
                  </div>
                  {conversation.unread && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#10B981] rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-manrope text-[14px] font-bold text-[#1E293B] truncate">
                      {conversation.contactName}
                    </h3>
                    <span className="font-manrope text-[12px] text-[#64748B] flex-shrink-0 ml-2">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <p
                    className={`
                      font-manrope text-[13px] truncate
                      ${conversation.unread ? "text-[#1E293B] font-medium" : "text-[#64748B]"}
                      ${conversation.status === "Missed Call" ? "text-[#EF4444]" : ""}
                    `}
                  >
                    {conversation.lastMessage}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Panel - Chat Interface */}
        <div
          className={`
          flex-1 flex flex-col bg-white
          ${showChat ? "flex" : "hidden md:flex"}
        `}
        >
          {/* Chat Header */}
          {activeConv && (
            <div className="p-4 md:p-6 border-b border-[#E5E7EB] flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-manrope text-[14px] md:text-[16px] font-bold relative flex-shrink-0"
                  style={{
                    backgroundColor: activeConv.contactColor + "20",
                    color: activeConv.contactColor,
                  }}
                >
                  {activeConv.contactInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2 className="font-manrope text-[15px] md:text-[16px] font-bold text-[#1E293B] truncate">
                      {activeConv.contactName}
                    </h2>
                    {activeConv.contactRole && (
                      <span className="px-2 py-0.5 bg-[#10B981] text-white rounded font-manrope text-[10px] font-bold flex-shrink-0">
                        {activeConv.contactRole}
                      </span>
                    )}
                    {activeConv.orderId && (
                      <span className="px-2 py-0.5 bg-[#1E293B] text-white rounded font-manrope text-[10px] font-bold flex-shrink-0">
                        {activeConv.orderId}
                      </span>
                    )}
                  </div>
                  <p className="font-manrope text-[11px] md:text-[12px] text-[#64748B] truncate">
                    We messaged • Last active 25m ago
                  </p>
                </div>
              </div>
              <button className="p-2 text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors flex-shrink-0">
                <MoreVertical size={20} />
              </button>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {!messages || messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="font-manrope text-[14px] text-[#64748B]">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              <>
                {/* Today Label */}
                <div className="flex items-center justify-center mb-6">
                  <div className="px-4 py-1 bg-[#1E293B] text-white rounded-full font-manrope text-[11px] font-bold">
                    Today
                  </div>
                </div>

                {/* Messages */}
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-2 md:gap-3 ${message.sender === "vendor" ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender === "customer" && (
                      <div
                        className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-manrope text-[11px] md:text-[12px] font-bold flex-shrink-0"
                        style={{
                          backgroundColor: message.color + "20",
                          color: message.color,
                        }}
                      >
                        {message.initials}
                      </div>
                    )}

                    <div
                      className={`
                        max-w-[85%] md:max-w-[500px] px-3 md:px-4 py-2 md:py-3 rounded-2xl
                        ${
                          message.sender === "vendor"
                            ? "bg-[#F8FAFC] text-[#1E293B]"
                            : "bg-[#FEF3C7] text-[#1E293B]"
                        }
                      `}
                    >
                      <p className="font-manrope text-[13px] md:text-[14px] leading-relaxed break-words">
                        {message.message}
                      </p>
                      <p className="font-manrope text-[10px] md:text-[11px] text-[#64748B] mt-1">
                        {message.timestamp}
                      </p>
                    </div>

                    {message.sender === "vendor" && (
                      <div
                        className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-manrope text-[11px] md:text-[12px] font-bold flex-shrink-0"
                        style={{
                          backgroundColor: message.color + "20",
                          color: message.color,
                        }}
                      >
                        {message.initials}
                      </div>
                    )}
                  </motion.div>
                ))}
              </>
            )}
          </div>

          {/* Quick Replies */}
          <div className="px-4 md:px-6 py-3 border-t border-[#E5E7EB]">
            <div className="flex gap-2 overflow-x-auto pb-2 -mb-2">
              {mockQuickReplies.map((reply, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickReply(reply)}
                  className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-full font-manrope text-[13px] text-[#64748B] hover:bg-[#F8FAFC] hover:border-[#1E293B] hover:text-[#1E293B] transition-colors whitespace-nowrap flex-shrink-0"
                >
                  {reply}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 md:p-6 border-t border-[#E5E7EB]">
            <div className="flex items-end gap-2 md:gap-3">
              {/* Attachment buttons - Hidden on mobile */}
              <div className="hidden sm:flex gap-2">
                <button className="p-2 text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors">
                  <Paperclip size={20} />
                </button>
                <button className="p-2 text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors">
                  <Smile size={20} />
                </button>
                <button className="p-2 text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors">
                  <ImageIcon size={20} />
                </button>
              </div>

              {/* Text input */}
              <div className="flex-1">
                <textarea
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={1}
                  className="w-full px-3 md:px-4 py-2 md:py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg font-manrope text-[13px] md:text-[14px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent resize-none"
                />
              </div>

              {/* Send button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || sendMessage.isLoading}
                className="px-4 md:px-6 py-2 md:py-3 bg-[#1E293B] text-white rounded-lg font-manrope text-[13px] font-medium hover:bg-[#334155] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span className="hidden sm:inline">Send</span>
                <Send size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react"; // Import useEffect
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Upload, Send, FileText, Bot, Plus, Clock, User } from "lucide-react";
import { uploadReport, getDiagnosis, getDiagnosesHistory, getDiagnosisById } from "@/services/apiService"; // Import the new history function
import { DiagnosisCard } from "@/components/DiagnosisCard";


interface HistoryItem {
  _id: string;
  symptoms: string;
  createdAt: string;
}

interface Message {
  id: string;
  content: string | React.ReactNode;
  sender: "user" | "bot";
  timestamp: Date;
  file?: {
    name: string;
    type: string;
  };
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your LabSense assistant. I can help you understand your lab results in plain English. Upload your lab report or ask me any questions about your health data.",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getDiagnosesHistory();
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setIsHistoryLoading(false);
      }
    };
    fetchHistory();
  }, []);


  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
      file: selectedFile ? { name: selectedFile.name, type: selectedFile.type } : undefined,
    };
    setMessages(prev => [...prev, userMessage]);

    const currentFile = selectedFile;
    const currentInput = inputMessage;
    setInputMessage("");
    setSelectedFile(null);

    const thinkingMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: thinkingMessageId,
      content: "Analyzing your information, please wait...",
      sender: 'bot',
      timestamp: new Date()
    }]);

    try {
      let reportId = null;
      if (currentFile) {
        const uploadResponse = await uploadReport(currentFile, "User Upload", "Lab Report");
        reportId = uploadResponse.data._id;

        setMessages(prev => prev.map(m => m.id === thinkingMessageId ? { ...m, content: "Report processed. Now getting AI diagnosis..." } : m));
      }

      const diagnosisResponse = await getDiagnosis(currentInput, reportId);
      const aiContent = (
        <DiagnosisCard aiResponse={diagnosisResponse.data.aiResponse} />
      );

      setMessages(prev => prev.map(m => m.id === thinkingMessageId ? { ...m, content: aiContent } : m));

    } catch (error) {
      setMessages(prev => prev.map(m => m.id === thinkingMessageId ? { ...m, content: (error as Error).message } : m));
    }
  };




  function formatTime(timestamp: Date): React.ReactNode {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? "s" : ""} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;

    return timestamp.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }

  const initialBotMessage: Message = {
    id: "1",
    content: "Hello! I'm your LabSense assistant. I can help you understand your lab results in plain English. Upload your lab report or ask me any questions about your health data.",
    sender: "bot",
    timestamp: new Date()
  };

  const handleNewChat = () => {
    setMessages([initialBotMessage]);
  };

  const handleHistorySelect = async (id: string) => {
        try {
            // Add a temporary loading message
            setMessages([{
                id: Date.now().toString(),
                content: 'Loading past diagnosis...',
                sender: 'bot',
                timestamp: new Date()
            }]);

            const response = await getDiagnosisById(id);
            const diagnosis = response.data;

            // Reconstruct the conversation from the historical data
            const userMessage: Message = {
                id: `user-${diagnosis._id}`,
                content: diagnosis.symptoms,
                sender: "user",
                timestamp: new Date(diagnosis.createdAt),
            };

            const botMessage: Message = {
                id: `bot-${diagnosis._id}`,
                content: <DiagnosisCard aiResponse={diagnosis.aiResponse} />,
                sender: "bot",
                timestamp: new Date(diagnosis.createdAt),
            };

            setMessages([userMessage, botMessage]);

        } catch (error) {
            console.error("Failed to load diagnosis:", error);
        }
    };

  return (
    <div className="min-h-[92vh] bg-gradient-subtle flex">
      {/* Sidebar */}
      <div className="w-80 bg-card border-r border-border p-6 hidden lg:block">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Chat History</h2>
            <div className="space-y-2">
              {isHistoryLoading ? (
                <p className="text-sm text-muted-foreground">Loading history...</p>
              ) : history.length > 0 ? (
                history.map((chat) => (
                  <Card key={chat._id} onClick={() => handleHistorySelect(chat._id)} className="cursor-pointer hover:bg-accent/50 transition-colors border-0 shadow-soft">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <FileText className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate" title={chat.symptoms}>
                            {chat.symptoms}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(new Date(chat.createdAt))}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-4 text-center">No previous chats found.</p>
              )}
            </div>
          </div>
          <Separator />
          <Button onClick={handleNewChat} className="w-full justify-start" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </div>


      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">LabSense Assistant</h1>
              <p className="text-sm text-muted-foreground">AI-powered lab result analysis</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 animate-fade-in ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110 ${message.sender === "user"
                  ? "bg-primary"
                  : "bg-gradient-primary animate-glow"
                  }`}>
                  {message.sender === "user" ? (
                    <User className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  )}
                </div>

                <div className={`flex-1 max-w-3xl ${message.sender === "user" ? "text-right" : ""
                  }`}>
                  <Card className={`transition-all duration-300 hover:scale-[1.02] hover:shadow-medium ${message.sender === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-card"
                    } border-0 shadow-soft`}>
                    <CardContent className="p-4">
                      {message.file && (
                        <div className="mb-3 p-3 bg-accent/20 rounded-lg flex items-center space-x-2 animate-scale-in">
                          {message.file.type.includes('pdf') ? (
                            <FileText className="h-4 w-4 text-accent" />
                          ) : (
                            <FileText className="h-4 w-4 text-accent" />
                          )}
                          <span className="text-sm font-medium">{message.file.name}</span>
                        </div>
                      )}
                      <div className="text-sm leading-relaxed">{message.content}</div>
                      <p className={`text-xs mt-2 ${message.sender === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                        }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-card border-t border-border p-6">
          <div className="max-w-4xl mx-auto">
            {selectedFile && (
              <div className="mb-4 p-3 bg-accent-light rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {selectedFile.type.includes('pdf') ? (
                    <FileText className="h-4 w-4 text-accent" />
                  ) : (
                    <FileText className="h-4 w-4 text-accent" />
                  )}
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  ×
                </Button>
              </div>
            )}

            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <div className="flex items-end space-x-2">
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="file-upload"
                    />
                    <Button variant="outline" size="icon" asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4" />
                      </label>
                    </Button>
                  </div>

                  <Input
                    placeholder="Ask about your lab results or type a message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                </div>
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() && !selectedFile}
                className="bg-gradient-primary hover:shadow-medium hover:scale-105 transition-all duration-300"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-2 text-center">
              LabSense provides educational information only. Always consult healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
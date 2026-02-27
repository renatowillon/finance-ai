"use client";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  TrendingUp,
  PiggyBank,
  CreditCard,
  Target,
  Mic,
  MicOff,
  Plus,
  Camera,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../_components/ui/button";

import { cn } from "../_lib/utils";
import { Textarea } from "../_components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../_components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../_components/ui/avatar";
import { ScrollArea } from "../_components/ui/scroll-area";

interface TransacaoData {
  descricao: string;
  valor: number;
  tipo: "ENTRADA" | "SAIDA";
  categoria: string;
  data: string;
  banco?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  toolCall?: {
    name: string;
    arguments: TransacaoData;
  };
}

const suggestionQuestions = [
  {
    icon: TrendingUp,
    text: "Quais foram minhas despesas desta semana?",
    color: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    icon: PiggyBank,
    text: "Quanto recebi no mês passado?",
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: CreditCard,
    text: "Como está minha fatura de cartão?",
    color: "from-purple-500/20 to-purple-500/5",
  },
  {
    icon: Target,
    text: "Cadastre uma despesa de R$ 50 em Alimentação",
    color: "from-amber-500/20 to-amber-500/5",
  },
];

// Web Speech API types
interface SpeechRecognitionResult {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: { readonly [index: number]: SpeechRecognitionResult };
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export default function Willon() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [, setPendingTransaction] = useState<TransacaoData | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "pt-BR";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          toast.error(
            "Permissão de microfone negada. Habilite nas configurações do navegador.",
          );
        } else {
          toast.error("Erro ao reconhecer voz. Tente novamente.");
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Handle paste event for images
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            convertFileToBase64(file);
          }
          break;
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

  const convertFileToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setAttachedImage(base64);
      toast.success("Imagem anexada! Descreva o que deseja fazer.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor, selecione uma imagem.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Imagem muito grande. Máximo 10MB.");
        return;
      }
      convertFileToBase64(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setShowCamera(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      console.error("Camera error:", error);
      toast.error(
        "Não foi possível acessar a câmera. Verifique as permissões.",
      );
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const base64 = canvas.toDataURL("image/jpeg", 0.8);
      setAttachedImage(base64);
      toast.success("Foto capturada! Descreva o que deseja fazer.");
    }
    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const removeAttachedImage = () => {
    setAttachedImage(null);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Reconhecimento de voz não suportado neste navegador.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.info("Ouvindo... Fale agora.");
    }
  };

  const streamChat = async (userMessages: Message[], imageBase64?: string) => {
    const lastMessage = userMessages[userMessages.length - 1];

    const resp = await fetch("/api/willon-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: lastMessage.content,
        imageBase64: imageBase64 || null,
      }),
    });

    if (!resp.ok) {
      const error = await resp.json();
      throw new Error(error.error || "Erro ao conectar com Willon");
    }

    const data = await resp.json();
    setNeedsConfirmation(data.needsConfirmation || false);

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
      },
    ]);
  };

  const sendMessage = async (text: string) => {
    if ((!text.trim() && !attachedImage) || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content:
        text.trim() ||
        "Analise este comprovante e extraia os dados para cadastrar uma transação.",
      imageUrl: attachedImage || undefined,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    const imageToSend = attachedImage;
    setAttachedImage(null);
    setIsLoading(true);
    setPendingTransaction(null);

    try {
      await streamChat([...messages, userMsg], imageToSend || undefined);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao enviar mensagem",
      );
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  async function confirmTransaction() {
    const response = await fetch("/api/willon-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "confirm" }),
    });

    const data = await response.json();

    // adiciona resposta no chat
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
      },
    ]);

    setNeedsConfirmation(false);
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-background pb-20">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-primary/5 blur-[100px]" />
        <div className="bg-gradient-radial absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full from-primary/5 to-transparent" />
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90">
          <div className="relative w-full max-w-lg">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-2xl"
            />
            <div className="mt-6 flex justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={stopCamera}
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <X className="mr-2 h-5 w-5" />
                Cancelar
              </Button>
              <Button
                size="lg"
                onClick={capturePhoto}
                className="bg-primary hover:bg-primary/90"
              >
                <Camera className="mr-2 h-5 w-5" />
                Capturar
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-4 md:px-0">
          <div className="group relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-primary/60 opacity-50 blur-lg transition-opacity group-hover:opacity-75" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-xl">
              <Bot className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="bg-success absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background shadow-lg">
              <Sparkles className="text-success-foreground h-3 w-3" />
            </div>
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-3xl font-bold text-transparent">
              Willon
            </h1>
            <p className="text-sm text-muted-foreground">
              Seu assistente financeiro inteligente
            </p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-2xl backdrop-blur-xl">
          <ScrollArea className="h-full flex-1 p-3" ref={scrollRef}>
            {/* Messages */}
            {messages.length === 0 ? (
              <div className="flex w-full flex-col items-center justify-center gap-8 py-4">
                <div className="hidden max-w-2xl space-y-3 text-center md:block">
                  <h3 className="text-2xl font-semibold">
                    Olá! Eu sou o Willon 👋
                  </h3>
                  <p className="text-muted-foreground">
                    Analiso suas finanças, cadastro transações por voz, texto ou
                    comprovante, e te ajudo a entender gastos, receitas e
                    tendências!
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    📸 Dica: Tire foto ou envie um comprovante para cadastrar
                    automaticamente!
                  </p>
                </div>

                {/* Suggestion Cards */}
                <div className="mt-4 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                  {suggestionQuestions.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={i}
                        onClick={() => sendMessage(item.text)}
                        className={cn(
                          "group relative rounded-xl p-4 text-left transition-all duration-300",
                          "bg-gradient-to-br",
                          item.color,
                          "border border-border/50 hover:border-primary/30",
                          "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-background/50 p-2 transition-colors group-hover:bg-primary/10">
                            <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                          </div>
                          <span className="text-sm leading-snug text-foreground/80 transition-colors group-hover:text-foreground">
                            {item.text}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div key={message.id}>
                    <div
                      className={cn(
                        "flex gap-3 duration-300 animate-in fade-in-0 slide-in-from-bottom-2",
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start",
                      )}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-9 w-9 shrink-0 ring-2 ring-primary/20">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3 shadow-lg",
                          message.role === "user"
                            ? "rounded-tr-md bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
                            : "rounded-tl-md border border-border/50 bg-secondary/80 backdrop-blur-sm",
                        )}
                      >
                        {message.imageUrl && (
                          <img
                            src={message.imageUrl}
                            alt="Comprovante anexado"
                            className="mb-2 h-auto max-h-48 max-w-full rounded-lg object-contain"
                          />
                        )}
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                      {message.role === "user" && (
                        <Avatar className="h-9 w-9 shrink-0 ring-2 ring-border">
                          <AvatarFallback className="bg-secondary">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2">
                    <Avatar className="h-9 w-9 shrink-0 ring-2 ring-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-2xl rounded-tl-md border border-border/50 bg-secondary/80 px-4 py-3 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">
                          Analisando...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          {needsConfirmation && (
            <button
              onClick={confirmTransaction}
              className="mt-3 rounded-lg bg-green-600 px-4 py-2 text-white"
            >
              ✅ Confirmar Cadastro
            </button>
          )}

          {/* Input Area */}
          <div className="border-t border-border/50 bg-card/30 p-4 backdrop-blur-sm">
            {/* Attached Image Preview */}
            {attachedImage && (
              <div className="relative mb-3 inline-block">
                <img
                  src={attachedImage}
                  alt="Imagem anexada"
                  className="h-20 w-auto rounded-lg border border-border/50"
                />
                <button
                  onClick={removeAttachedImage}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground transition-colors hover:bg-destructive/90"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            <div className="flex items-end gap-2">
              {/* Attachment Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 shrink-0 rounded-xl border-border/50 transition-all hover:border-primary/30 hover:bg-primary/10"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem
                    onClick={startCamera}
                    className="cursor-pointer gap-3"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Tirar foto</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer gap-3"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Enviar imagem</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled
                    className="gap-3 text-muted-foreground"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-xs">Ctrl+V para colar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="relative flex-1">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    attachedImage
                      ? "Descreva o que deseja fazer com esta imagem..."
                      : "O que deseja lançar hoje?"
                  }
                  className="max-h-32 min-h-[45px] resize-none rounded-xl border-border/50 bg-background/50 pr-12 text-sm focus:border-primary/50 focus:ring-primary/20"
                  rows={1}
                />
                <Button
                  onClick={toggleListening}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-lg transition-all",
                    isListening
                      ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
                  )}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Button
                onClick={() => sendMessage(input)}
                disabled={(!input.trim() && !attachedImage) || isLoading}
                size="icon"
                className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 transition-all hover:from-primary/90 hover:to-primary/70 disabled:opacity-50 disabled:shadow-none"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
            <div ref={scrollRef} />
          </div>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div className="relative h-[100dvh] w-full overflow-hidden bg-background pb-20">
  //     {/* Background Effects */}
  //     <div className="pointer-events-none absolute inset-0 overflow-hidden">
  //       <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-[120px]" />
  //       <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-primary/5 blur-[100px]" />
  //       <div className="bg-gradient-radial absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full from-primary/5 to-transparent" />
  //     </div>

  //     {showCamera && (
  //       <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90">
  //         <div className="relative w-full max-w-lg">
  //           <video
  //             ref={videoRef}
  //             autoPlay
  //             playsInline
  //             className="w-full rounded-2xl"
  //           />
  //           <div className="mt-6 flex justify-center gap-4">
  //             <Button
  //               variant="outline"
  //               size="lg"
  //               onClick={stopCamera}
  //               className="border-white/20 bg-white/10 text-white hover:bg-white/20"
  //             >
  //               <X className="mr-2 h-5 w-5" />
  //               Cancelar
  //             </Button>
  //             <Button
  //               size="lg"
  //               onClick={capturePhoto}
  //               className="bg-primary hover:bg-primary/90"
  //             >
  //               <Camera className="mr-2 h-5 w-5" />
  //               Capturar
  //             </Button>
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //     <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col md:p-8">
  //       {/* Header */}
  //       <div className="flex shrink-0 items-center gap-4 px-4 py-4 md:px-0">
  //         <div className="relative">
  //           <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-xl">
  //             <Bot className="h-8 w-8 text-primary-foreground" />
  //           </div>
  //         </div>
  //         <div>
  //           <h1 className="text-3xl font-bold">Willon</h1>
  //           <p className="text-sm text-muted-foreground">
  //             Seu assistente financeiro inteligente
  //           </p>
  //         </div>
  //       </div>

  //       {/* Chat Container */}
  //       <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-2xl backdrop-blur-xl">
  //         {/* Scroll Area */}
  //         <ScrollArea className="flex-1 p-4">
  //           <div className="space-y-6">
  //             {messages.map((message) => (
  //               <div
  //                 key={message.id}
  //                 className={cn(
  //                   "flex gap-3",
  //                   message.role === "user" ? "justify-end" : "justify-start",
  //                 )}
  //               >
  //                 {message.role === "assistant" && (
  //                   <Avatar className="h-9 w-9 shrink-0">
  //                     <AvatarFallback className="bg-primary text-primary-foreground">
  //                       <Bot className="h-4 w-4" />
  //                     </AvatarFallback>
  //                   </Avatar>
  //                 )}

  //                 <div
  //                   className={cn(
  //                     "max-w-[80%] rounded-2xl px-4 py-3 shadow-lg",
  //                     message.role === "user"
  //                       ? "bg-primary text-primary-foreground"
  //                       : "bg-secondary",
  //                   )}
  //                 >
  //                   {message.imageUrl && (
  //                     <img
  //                       src={message.imageUrl}
  //                       alt="Imagem"
  //                       className="mb-2 max-h-48 rounded-lg"
  //                     />
  //                   )}
  //                   <p className="whitespace-pre-wrap text-sm">
  //                     {message.content}
  //                   </p>
  //                 </div>

  //                 {message.role === "user" && (
  //                   <Avatar className="h-9 w-9 shrink-0">
  //                     <AvatarFallback>
  //                       <User className="h-4 w-4" />
  //                     </AvatarFallback>
  //                   </Avatar>
  //                 )}
  //               </div>
  //             ))}

  //             {isLoading && (
  //               <div className="flex gap-3">
  //                 <Avatar className="h-9 w-9 shrink-0">
  //                   <AvatarFallback className="bg-primary text-primary-foreground">
  //                     <Bot className="h-4 w-4" />
  //                   </AvatarFallback>
  //                 </Avatar>
  //                 <div className="rounded-2xl bg-secondary px-4 py-3">
  //                   <Loader2 className="h-4 w-4 animate-spin" />
  //                 </div>
  //               </div>
  //             )}
  //           </div>
  //         </ScrollArea>

  //         {/* Confirm Button */}
  //         {needsConfirmation && (
  //           <div className="px-4 pb-2">
  //             <button
  //               onClick={confirmTransaction}
  //               className="w-full rounded-lg bg-green-600 py-2 text-white"
  //             >
  //               ✅ Confirmar Cadastro
  //             </button>
  //           </div>
  //         )}

  //         {/* Input Area */}
  //         <div className="shrink-0 border-t border-border/50 bg-card/30 p-4 backdrop-blur-sm">
  //           <div className="flex items-end gap-2">
  //             <div className="relative flex-1">
  //               <Textarea
  //                 value={input}
  //                 onChange={(e) => setInput(e.target.value)}
  //                 onKeyDown={handleKeyDown}
  //                 placeholder="O que deseja lançar hoje?"
  //                 className="min-h-[45px] resize-none rounded-xl pr-12"
  //                 rows={1}
  //               />
  //             </div>

  //             <Button
  //               onClick={() => sendMessage(input)}
  //               disabled={(!input.trim() && !attachedImage) || isLoading}
  //               size="icon"
  //               className="h-11 w-11 shrink-0 rounded-xl bg-primary"
  //             >
  //               {isLoading ? (
  //                 <Loader2 className="h-5 w-5 animate-spin" />
  //               ) : (
  //                 <Send className="h-5 w-5" />
  //               )}
  //             </Button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}

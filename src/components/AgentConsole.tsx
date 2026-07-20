import React, { useState, useEffect, useRef } from 'react';
import {
    Phone, PhoneOff, PhoneIncoming, Users, Bell, Play, Square, Settings,
    Activity, FileText, Layers, Volume2, Trash2, Plus, TrendingUp, CheckCircle,
    Wifi, WifiOff, Database, MapPin, CreditCard, Lock, Monitor, AlertTriangle
} from 'lucide-react';

interface AgentConsoleProps {
    onBackToLanding: () => void;
}

interface TranscriptLine {
    sender: 'agent' | 'customer' | 'system';
    text: string;
    time: string;
}

export const AgentConsole: React.FC<AgentConsoleProps> = ({ onBackToLanding }) => {
    // Navigation within Console
    const [activeTab, setActiveTab] = useState<'dialer' | 'campaigns' | 'ivr' | 'reports'>('dialer');

    // Network State Simulator
    const [networkMode, setNetworkMode] = useState<'normal' | 'gsm-failover'>('normal');

    // Softphone Dialer state
    const [dialNumber, setDialNumber] = useState('');
    const [callState, setCallState] = useState<'idle' | 'calling' | 'active' | 'held' | 'wrapup'>('idle');
    const [callDuration, setCallDuration] = useState(0);
    const [callerName, setCallerName] = useState('N/A');
    const [callerCarrier, setCallerCarrier] = useState('');
    const [callerLocation, setCallerLocation] = useState('');
    const [callerScript, setCallerScript] = useState('');
    const [activeAlert, setActiveAlert] = useState<{ id: string; name: string; number: string; type: 'support' | 'sales' } | null>(null);

    // Live dialogue chat feed
    const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
    const transcriptTimerRef = useRef<any>(null);
    const durationTimerRef = useRef<any>(null);

    // Bulk Voice campaigns state
    const [campaignName, setCampaignName] = useState('Bulk Order Dispatch Update');
    const [campaignTargets, setCampaignTargets] = useState(40);
    const [campaignProgress, setCampaignProgress] = useState(0);
    const [campaignIsRunning, setCampaignIsRunning] = useState(false);
    const [campaignCompleted, setCampaignCompleted] = useState(0);
    const [campaignStats, setCampaignStats] = useState({ answered: 0, busy: 0, voicemail: 0 });
    const [campaignLogs, setCampaignLogs] = useState<string[]>([]);
    const campaignTimerRef = useRef<any>(null);

    // Visual IVR state
    const [selectedIvrNodeId, setSelectedIvrNodeId] = useState<string | null>('root');

    // Reports view metrics
    const [liveQueueLength, setLiveQueueLength] = useState(2);
    const [liveAgentsCount, setLiveAgentsCount] = useState(11);
    const [liveCallLogs, setLiveCallLogs] = useState<Array<{ id: string; number: string; duration: string; route: string; time: string; status: string }>>([
        { id: '1', number: '+234 81 2282 9901', duration: '2m 14s', route: 'Support', time: '10:44 AM', status: 'Resolved' },
        { id: '2', number: '+234 90 5510 4421', duration: '5m 01s', route: 'Billing', time: '10:41 AM', status: 'Escalated' },
        { id: '3', number: '+234 80 3218 8491', duration: '1m 30s', route: 'Sales', time: '10:35 AM', status: 'Resolved' },
    ]);

    // Audio tone generator using Web Audio API (Synthesizing tones)
    const playAlertTone = (freq = 440, duration = 0.1, type: OscillatorType = 'sine') => {
        try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.warn("Audio context not allowed or unsupported by browser sandbox guidelines", e);
        }
    };

    const playDTMF = (digit: string) => {
        try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const frequencies: { [key: string]: [number, number] } = {
                '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
                '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
                '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
                '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
            };
            if (!frequencies[digit]) return;
            const f = frequencies[digit];

            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc1.frequency.value = f[0];
            osc2.frequency.value = f[1];

            gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc1.start();
            osc2.start();
            osc1.stop(audioCtx.currentTime + 0.2);
            osc2.stop(audioCtx.currentTime + 0.2);
        } catch (e) {
            console.warn("DTMF tone block", e);
        }
    };

    const handleKeypadClick = (digit: string) => {
        setDialNumber((prev) => prev + digit);
        playDTMF(digit);
    };

    const handleClearDigit = () => {
        setDialNumber((prev) => prev.slice(0, -1));
        playAlertTone(280, 0.08);
    };

    // Call Active Timer
    useEffect(() => {
        if (callState === 'active') {
            durationTimerRef.current = setInterval(() => {
                setCallDuration((prev) => prev + 1);
            }, 1000);
        } else {
            if (durationTimerRef.current) {
                clearInterval(durationTimerRef.current);
            }
        }
        return () => clearInterval(durationTimerRef.current);
    }, [callState]);

    // Handle dial button (Outbound call action simulation)
    const handleDialOutbound = () => {
        if (!dialNumber) return;
        playAlertTone(520, 0.15);
        setCallState('calling');
        setCallerName("Outbound Subscriber");
        setCallerLocation("Unknown Trunk");
        setCallerCarrier("GSM Router");
        setCallerScript("Informing subscriber on outbound queue update. Retain caller on support line.");
        setTranscript([{ sender: 'system', text: `Initiating dialing trunk to ${dialNumber}...`, time: '0:00' }]);

        // After 2.5 seconds, connect the call as active
        setTimeout(() => {
            setCallState('active');
            setCallDuration(0);
            playAlertTone(660, 0.18);
            setTranscript((prev) => [
                ...prev,
                { sender: 'system', text: 'Call Answered by Outbound Customer.', time: '0:00' },
                { sender: 'customer', text: "Hello? Who is on the line, please?", time: '0:01' },
                { sender: 'agent', text: "Hello, this is Sky Agent customer support following up on your ticket. Can you hear me clearly?", time: '0:04' },
                { sender: 'customer', text: "Yes, I hear you perfectly. The connection is very clear.", time: '0:08' },
            ]);
        }, 2500);
    };

    // End active call session
    const handleEndCall = () => {
        playAlertTone(200, 0.25);
        setCallState('wrapup');
        if (transcriptTimerRef.current) clearInterval(transcriptTimerRef.current);

        setTimeout(() => {
            // Add call record to log history lists
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const record = {
                id: Math.random().toString(),
                number: dialNumber || activeAlert?.number || '+234 803 555 1019',
                duration: `${Math.floor(callDuration / 60)}m ${callDuration % 60}s`,
                route: activeAlert?.type === 'sales' ? 'Sales' : 'Support',
                time: timeString,
                status: 'Resolved'
            };
            setLiveCallLogs((prev) => [record, ...prev]);

            setCallState('idle');
            setCallDuration(0);
            setDialNumber('');
            setActiveAlert(null);
            setTranscript([]);
        }, 1500); // 1.5s wrap-up wrap
    };

    // Switch Hold status
    const handleToggleHold = () => {
        if (callState === 'active') {
            setCallState('held');
            playAlertTone(440, 0.1);
            setTranscript((prev) => [...prev, { sender: 'system', text: 'Call put on Hold by agent.', time: 'System' }]);
        } else if (callState === 'held') {
            setCallState('active');
            playAlertTone(520, 0.1);
            setTranscript((prev) => [...prev, { sender: 'system', text: 'Call Resumed from Hold.', time: 'System' }]);
        }
    };

    // Trigger Incoming simulated call
    const triggerInboundSimulation = (type: 'support' | 'sales') => {
        if (callState !== 'idle' || activeAlert !== null) return;

        // Play ringing tone
        playAlertTone(580, 0.4);
        setTimeout(() => playAlertTone(580, 0.4), 600);

        if (type === 'support') {
            setActiveAlert({
                id: 'sup_99',
                name: 'Tunde Alabi',
                number: '+234 803 555 0192',
                type: 'support'
            });
        } else {
            setActiveAlert({
                id: 'sale_41',
                name: 'Mrs. Amina Yusuf',
                number: '+234 809 122 3841',
                type: 'sales'
            });
        }
    };

    // Answer Incoming simulator
    const handleAnswerAlert = () => {
        if (!activeAlert) return;
        playAlertTone(660, 0.2);
        setCallState('active');
        setCallDuration(0);

        if (activeAlert.type === 'support') {
            setCallerName("Tunde Alabi");
            setCallerLocation("Lekki Phase 1, Lagos");
            setCallerCarrier("MTN Fiber Trunk");
            setCallerScript("Fiber broadband cut on Lekki Admiralty Way. Acknowledge local GSM failover active.");

            const dialogue: TranscriptLine[] = [
                { sender: 'system', text: `Inbound Call routed to Support Node. Carrier: MTN Nigeria. Location: Lagos.`, time: '0:00' },
                { sender: 'customer', text: "Hello? Yes good morning. This is Tunde here from Lekki. We are having fiber WAN outages and our agents got disconnected.", time: '0:01' },
                { sender: 'agent', text: "Good morning Mr. Tunde. Yes, we are aware of a fiber cut on Admiralty Way, Lekki. How are your lines performing?", time: '0:06' },
                { sender: 'customer', text: "Wait, our backup Sky Agent lines are ringing on mobile GSM trunks! We are receiving calls offline. That is fantastic!", time: '0:11' },
                { sender: 'agent', text: "Correct. Sky Agent routes incoming calls to local SIM cards automatically if your broadband fails. Your agents won't miss a customer.", time: '0:17' },
                { sender: 'customer', text: "Yes, that completely saved us this morning. Thank you so much for the quick confirmation!", time: '0:22' },
                { sender: 'system', text: "Customer has marked query resolved.", time: '0:25' }
            ];

            loadMockDialogue(dialogue);
        } else {
            setCallerName("Mrs. Amina Yusuf");
            setCallerLocation("Asokoro, Abuja");
            setCallerCarrier("9mobile SIM Network");
            setCallerScript("Company: Alhaji & Sons Retailers. Active: 45 agent requirement. Propose Paystack 20% discount package.");

            const dialogue: TranscriptLine[] = [
                { sender: 'system', text: `Inbound Call routed to Sales Node. Carrier: 9mobile. Location: Abuja.`, time: '0:00' },
                { sender: 'customer', text: "Hi, I am calling from Abuja. We are looking to migrate 45 agents to a cloud PBX. Does your pricing support local Naira?", time: '0:01' },
                { sender: 'agent', text: "Hello Mrs. Amina Yusuf. Yes, we support local Naira cards and direct bank transfers via Paystack, avoiding any FX transaction limits.", time: '0:07' },
                { sender: 'customer', text: "That is excellent. Do you also provide local telephone DID numbers for Abuja area code?", time: '0:12' },
                { sender: 'agent', text: "Yes, we provision area code 09 (Abuja) as well as 01 (Lagos) instantly on your virtual console workspace.", time: '0:18' },
                { sender: 'customer', text: "Perfect. Send the custom quote to my email. We are ready to sign up.", time: '0:23' }
            ];

            loadMockDialogue(dialogue);
        }
    };

    const loadMockDialogue = (lines: TranscriptLine[]) => {
        setTranscript([lines[0]]);
        let currentIdx = 1;

        if (transcriptTimerRef.current) clearInterval(transcriptTimerRef.current);

        transcriptTimerRef.current = setInterval(() => {
            if (currentIdx < lines.length) {
                setTranscript((prev) => [...prev, lines[currentIdx]]);
                currentIdx++;
            } else {
                clearInterval(transcriptTimerRef.current);
            }
        }, 4500); // Feed dialogue every 4.5 seconds
    };

    // Voice Broadcast Outbound Campaigns Simulator
    const handleStartCampaign = () => {
        if (campaignIsRunning) {
            setCampaignIsRunning(false);
            if (campaignTimerRef.current) clearInterval(campaignTimerRef.current);
            setCampaignLogs((prev) => [`[${new Date().toLocaleTimeString()}] Campaign manual halt triggered.`, ...prev]);
            return;
        }

        setCampaignIsRunning(true);
        setCampaignProgress(0);
        setCampaignCompleted(0);
        setCampaignStats({ answered: 0, busy: 0, voicemail: 0 });
        setCampaignLogs([`[${new Date().toLocaleTimeString()}] Outbound Broadcast Campaign '${campaignName}' started. targeting ${campaignTargets} leads...`]);

        let step = 0;

        campaignTimerRef.current = setInterval(() => {
            step += 1;
            const progressPercent = Math.min((step / campaignTargets) * 100, 100);
            setCampaignProgress(progressPercent);
            setCampaignCompleted(step);

            // Random state outcome
            const rand = Math.random();
            const number = `+234 803 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`;

            if (rand < 0.70) {
                // Answered & Played TTS
                setCampaignStats((prev) => ({ ...prev, answered: prev.answered + 1 }));
                setCampaignLogs((prev) => [
                    `[${new Date().toLocaleTimeString()}] Outbound ${number} ANSWERED. Audio TTS prompt played successfully. Duration 18s.`,
                    ...prev
                ]);
            } else if (rand < 0.88) {
                // Busy
                setCampaignStats((prev) => ({ ...prev, busy: prev.busy + 1 }));
                setCampaignLogs((prev) => [
                    `[${new Date().toLocaleTimeString()}] Outbound ${number} BUSY trunk. Re-queued for retry dial.`,
                    ...prev
                ]);
            } else {
                // Answering machine / drop
                setCampaignStats((prev) => ({ ...prev, voicemail: prev.voicemail + 1 }));
                setCampaignLogs((prev) => [
                    `[${new Date().toLocaleTimeString()}] Outbound ${number} DETECTED Answering Machine (Trunk Glo Voicemail). Dial hang-up.`,
                    ...prev
                ]);
            }

            if (step >= campaignTargets) {
                setCampaignIsRunning(false);
                clearInterval(campaignTimerRef.current);
                setCampaignLogs((prev) => [
                    `\n[${new Date().toLocaleTimeString()}] Campaign COMPLETED. Dialed ${campaignTargets} targets. Answers: ${campaignStats.answered + (rand < 0.70 ? 1 : 0)}.`,
                    ...prev
                ]);
                playAlertTone(900, 0.4);
            }
        }, 800); // 800ms speed dial dials numbers quickly
    };

    // Toggle Internet/GSM network simulator mode
    const toggleNetworkMode = () => {
        if (networkMode === 'normal') {
            setNetworkMode('gsm-failover');
            playAlertTone(320, 0.1);
            setTimeout(() => playAlertTone(280, 0.25), 120);

            // Append logs
            setLiveCallLogs((prev) => [
                { id: Math.random().toString(), number: "System Router", duration: "Backup", route: "Broadband Down", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: "GSM Actived" },
                ...prev
            ]);
        } else {
            setNetworkMode('normal');
            playAlertTone(440, 0.1);
            setTimeout(() => playAlertTone(520, 0.15), 100);
        }
    };

    // Formatted duration helper
    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec.toString().padStart(2, '0')}`;
    };

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            if (transcriptTimerRef.current) clearInterval(transcriptTimerRef.current);
            if (durationTimerRef.current) clearInterval(durationTimerRef.current);
            if (campaignTimerRef.current) clearInterval(campaignTimerRef.current);
        };
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {/* Simulation Controls Panel (Header notification-bar) */}
            <div className="sim-controls-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ea580c', fontSize: '13px', fontWeight: 'bold' }}>
                    <AlertTriangle size={16} /> SIMULATOR CONSOLE:
                </div>
                <button
                    className="btn-secondary"
                    style={{ fontSize: '12px', padding: '6px 12px', borderColor: '#ea580c', color: 'var(--text-primary)' }}
                    onClick={() => triggerInboundSimulation('support')}
                    disabled={callState !== 'idle' || activeAlert !== null}
                >
                    📞 Trigger Inbound Support (Lekki cuts)
                </button>
                <button
                    className="btn-secondary"
                    style={{ fontSize: '12px', padding: '6px 12px', borderColor: '#ea580c', color: 'var(--text-primary)' }}
                    onClick={() => triggerInboundSimulation('sales')}
                    disabled={callState !== 'idle' || activeAlert !== null}
                >
                    💼 Trigger Inbound Sales (Abuja migration)
                </button>
                <button
                    className="btn-secondary"
                    style={{
                        fontSize: '12px',
                        padding: '6px 12px',
                        backgroundColor: networkMode === 'gsm-failover' ? '#ea580c' : 'transparent',
                        borderColor: '#ea580c',
                        color: networkMode === 'gsm-failover' ? 'white' : 'var(--text-primary)'
                    }}
                    onClick={toggleNetworkMode}
                >
                    {networkMode === 'gsm-failover' ? <WifiOff size={13} style={{ marginRight: 4 }} /> : <Wifi size={13} style={{ marginRight: 4 }} />}
                    {networkMode === 'gsm-failover' ? "GSM TRUNK BACKUP ACTIVE" : "Simulate Broadband Failure"}
                </button>
            </div>

            {/* Main Console Box */}
            <span className="console-wrapper">
                {/* Sidebar Nav */}
                <aside className="console-sidebar">
                    <div className="sidebar-nav">
                        <button
                            className={`sidebar-btn ${activeTab === 'dialer' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dialer')}
                        >
                            <Phone size={18} /> Dialer & Workspace
                        </button>
                        <button
                            className={`sidebar-btn ${activeTab === 'campaigns' ? 'active' : ''}`}
                            onClick={() => setActiveTab('campaigns')}
                        >
                            <Play size={18} /> Voice Campaign
                        </button>
                        <button
                            className={`sidebar-btn ${activeTab === 'ivr' ? 'active' : ''}`}
                            onClick={() => setActiveTab('ivr')}
                        >
                            <Layers size={18} /> IVR Flow Builder
                        </button>
                        <button
                            className={`sidebar-btn ${activeTab === 'reports' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reports')}
                        >
                            <Activity size={18} /> Real-Time Analytics
                        </button>
                    </div>

                    <div style={{ padding: '16px' }} className="hidden-mobile">
                        <button
                            className="btn-secondary"
                            style={{ width: '100%', fontSize: '13px' }}
                            onClick={onBackToLanding}
                        >
                            Exit Console View
                        </button>
                    </div>
                </aside>

                {/* Dynamic Inner Panel content */}
                <div className="console-content">
                    <main className="console-main-panel">
                        {/* INCOMING ALERT POPUP MODAL */}
                        {activeAlert && callState === 'idle' && (
                            <div className="glass alert-inbound-card" style={{ padding: '20px', borderRadius: '12px', border: '2px solid var(--primary)', marginBottom: '24px', backgroundColor: 'rgba(10, 132, 255, 0.08)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="animate-pulse-glow" style={{ padding: '10px', background: 'var(--success)', borderRadius: '50%', color: 'white' }}>
                                            <PhoneIncoming size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>Incoming {activeAlert.type === 'support' ? 'Support' : 'Sales'} Queue Call</h4>
                                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{activeAlert.name} ({activeAlert.number})</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="btn-primary" style={{ background: 'var(--success)' }} onClick={handleAnswerAlert}>
                                            Answer
                                        </button>
                                        <button className="btn-secondary" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => setActiveAlert(null)}>
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: DIALER CRM */}
                        {activeTab === 'dialer' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
                                {callState === 'idle' ? (
                                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                                        <IconBadge icon={Phone} />
                                        <h3 style={{ marginTop: '16px', color: 'var(--text-primary)' }}>Agent Terminal Idle</h3>
                                        <p style={{ maxWidth: '400px', margin: '8px auto 0', fontSize: '13px' }}>
                                            Add numbers on softphone dial pad to make an outbound call, or initiate live phone calls via the SIMULATOR CONSOLE triggers above.
                                        </p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        {/* Active CRM client card status */}
                                        <div className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                                                <div>
                                                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>ACTIVE ENQUIRY CRM:</span>
                                                    <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '4px 0' }}>{callerName}</h3>
                                                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} /> {callerLocation}</span>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Database size={13} /> {callerCarrier}</span>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>DURATION STATUS:</span>
                                                    <h4 style={{ fontSize: '22px', fontFamily: 'var(--mono)', color: 'var(--primary)' }}>
                                                        {formatTime(callDuration)}
                                                    </h4>
                                                    <span style={{ fontSize: '11px', color: 'var(--success)' }}>● Outbound SIM Active</span>
                                                </div>
                                            </div>

                                            {/* Caller Advisor script card */}
                                            <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', margin: '16px 0 0', padding: '12px 16px', borderRadius: '8px' }}>
                                                <div style={{ display: 'flex', gap: '8px', color: 'var(--warning)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>
                                                    <AlertTriangle size={14} /> AI Copilot Script Guideline:
                                                </div>
                                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{callerScript}</p>
                                            </div>
                                        </div>

                                        {/* Live active text transcript */}
                                        <div>
                                            <h4 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--text-secondary)' }}>Live Conversation Audio Transcript</h4>
                                            <div className="transcript-box">
                                                {transcript.map((line, idx) => (
                                                    <div key={idx} className={`transcript-bubble ${line.sender}`}>
                                                        <span style={{ fontSize: '10px', display: 'block', opacity: 0.7, marginBottom: '2px' }}>
                                                            {line.sender.toUpperCase()}
                                                        </span>
                                                        {line.text}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB CONTENT: BULK OUTBOUND BROADCAST CAMPAIGNS */}
                        {activeTab === 'campaigns' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
                                    <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Outbound Broadcast Campaign Scheduler</h3>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16.px', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Campaign Title</label>
                                            <input
                                                type="text"
                                                value={campaignName}
                                                onChange={(e) => setCampaignName(e.target.value)}
                                                className="prompt-select"
                                                style={{ background: 'var(--bg-app)' }}
                                                disabled={campaignIsRunning}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Campaign Targets (Bulk Rows)</label>
                                            <input
                                                type="number"
                                                value={campaignTargets}
                                                onChange={(e) => setCampaignTargets(Number(e.target.value))}
                                                className="prompt-select"
                                                style={{ background: 'var(--bg-app)' }}
                                                min="5"
                                                max="200"
                                                disabled={campaignIsRunning}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        className="btn-primary"
                                        style={{ width: '100%', background: campaignIsRunning ? 'var(--danger)' : 'var(--primary)', justifyContent: 'center' }}
                                        onClick={handleStartCampaign}
                                    >
                                        {campaignIsRunning ? (
                                            <>
                                                <Square size={16} /> Cease Campaign Dialing
                                            </>
                                        ) : (
                                            <>
                                                <Play size={16} /> Launch Voice Broadcast Campaign
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Live bulk calling report feedback details */}
                                {(campaignIsRunning || campaignCompleted > 0) && (
                                    <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Progress status: {campaignCompleted} / {campaignTargets} dialed</span>
                                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{Math.round(campaignProgress)}% Complete</span>
                                        </div>

                                        <div className="progress-bar-container" style={{ marginBottom: '24px' }}>
                                            <div className="progress-bar-fill" style={{ width: `${campaignProgress}%` }}></div>
                                        </div>

                                        <div className="campaign-stats-grid">
                                            <div className="glass" style={{ padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--success)' }}>
                                                    {campaignStats.answered}
                                                </span>
                                                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)' }}>TTS Answered</span>
                                            </div>
                                            <div className="glass" style={{ padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--warning)' }}>
                                                    {campaignStats.busy}
                                                </span>
                                                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)' }}>Busy/Unavailable</span>
                                            </div>
                                            <div className="glass" style={{ padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--danger)' }}>
                                                    {campaignStats.voicemail}
                                                </span>
                                                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)' }}>Voicemail Det.</span>
                                            </div>
                                            <div className="glass" style={{ padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary)' }}>
                                                    {campaignCompleted ? Math.round((campaignStats.answered / campaignCompleted) * 100) : 0}%
                                                </span>
                                                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)' }}>Success Rate</span>
                                            </div>
                                        </div>

                                        <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Real-time Campaign Dial Log</h4>
                                        <div className="live-log-container">
                                            {campaignLogs.map((log, idx) => (
                                                <div key={idx} style={{ marginBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '4px' }}>{log}</div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB CONTENT: VISUAL IVR BUILDER */}
                        {activeTab === 'ivr' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
                                    <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>Interactive Voice Response (IVR) Canvas</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                                        Visual schematic of how incoming phone traffic directs automatically based on custom user keypad DTMF inputs. Click on any card node card below to audit properties.
                                    </p>

                                    <div className="ivr-flow-preview">
                                        {/* Root Block */}
                                        <div
                                            className="ivr-node"
                                            style={{ borderLeftColor: 'var(--primary)', cursor: 'pointer', borderColor: selectedIvrNodeId === 'root' ? 'var(--primary)' : 'var(--border-color)' }}
                                            onClick={() => setSelectedIvrNodeId('root')}
                                        >
                                            <div className="ivr-node-accent" style={{ background: 'var(--primary)' }}></div>
                                            <div>
                                                <strong>Virtual Inbound SIP Trunk: +234 1 700 8490</strong>
                                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Welcome Prompt Speech: "Welcome to Alhaji Retailers..."</p>
                                            </div>
                                        </div>

                                        <div className="ivr-con-line"></div>

                                        {/* Nodes options section */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                            <div
                                                className="ivr-node"
                                                style={{ flexDirection: 'column', textAlign: 'center', cursor: 'pointer', borderColor: selectedIvrNodeId === 'press1' ? 'var(--primary)' : 'var(--border-color)' }}
                                                onClick={() => setSelectedIvrNodeId('press1')}
                                            >
                                                <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--success)' }}>[ Key 1 ]</span>
                                                <strong style={{ fontSize: '13px' }}>Sales Hub</strong>
                                                <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Route to Lagos Sales Group</p>
                                            </div>

                                            <div
                                                className="ivr-node"
                                                style={{ flexDirection: 'column', textAlign: 'center', cursor: 'pointer', borderColor: selectedIvrNodeId === 'press2' ? 'var(--primary)' : 'var(--border-color)' }}
                                                onClick={() => setSelectedIvrNodeId('press2')}
                                            >
                                                <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--warning)' }}>[ Key 2 ]</span>
                                                <strong style={{ fontSize: '13px' }}>Support Team</strong>
                                                <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Route to Abuja Support Group</p>
                                            </div>

                                            <div
                                                className="ivr-node"
                                                style={{ flexDirection: 'column', textAlign: 'center', cursor: 'pointer', borderColor: selectedIvrNodeId === 'press3' ? 'var(--primary)' : 'var(--border-color)' }}
                                                onClick={() => setSelectedIvrNodeId('press3')}
                                            >
                                                <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--danger)' }}>[ Key 3 ]</span>
                                                <strong style={{ fontSize: '13px' }}>CRM Check</strong>
                                                <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Read Balance Speech TTS</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Node properties inspector panel */}
                                {selectedIvrNodeId && (
                                    <div className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
                                        <div style={{ display: 'flex', gap: '8px', color: 'var(--primary)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                                            <Settings size={14} /> Node Property Inspector
                                        </div>
                                        {selectedIvrNodeId === 'root' && (
                                            <div>
                                                <h4 style={{ fontSize: '15px', fontWeight: 'bold' }}>Trunk Entry Greeting settings</h4>
                                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                    Plays when outbound/inbound callers enter the system. The platform loads TTS settings from the dashboard data tables to execute dialing response prompts.
                                                </p>
                                            </div>
                                        )}
                                        {selectedIvrNodeId === 'press1' && (
                                            <div>
                                                <h4 style={{ fontSize: '15px', fontWeight: 'bold' }}>Department Route: Lagos Sales (Ring Group 18)</h4>
                                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                    Key routing destination. Attempts to dial 4 agents in the sales team concurrently using parallel SIP trunks on Glo and MTN networks.
                                                </p>
                                            </div>
                                        )}
                                        {selectedIvrNodeId === 'press2' && (
                                            <div>
                                                <h4 style={{ fontSize: '15px', fontWeight: 'bold' }}>Department Route: Abuja Tech Support (Ring Group 22)</h4>
                                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                    Attempts sequential routing. If lag or connection loss occurs during broadband outages, the system automatically redirects lines to local SIM mobile towers.
                                                </p>
                                            </div>
                                        )}
                                        {selectedIvrNodeId === 'press3' && (
                                            <div>
                                                <h4 style={{ fontSize: '15px', fontWeight: 'bold' }}>Automated Query: Client Balance Readout</h4>
                                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                    Links directly to cloud databases via API. Reads account balance details aloud without requiring human agent interaction, solving 40% of standard ticket requests.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB CONTENT: ANALYTICS REPORTS */}
                        {activeTab === 'reports' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                    <div className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Queue Length</span>
                                            <Users size={16} style={{ color: 'var(--primary)' }} />
                                        </div>
                                        <h3 style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>{liveQueueLength} Calls</h3>
                                        <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Hold time tolerance: 2m 10s max</p>
                                    </div>

                                    <div className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Active Agents</span>
                                            <Monitor size={16} style={{ color: 'var(--success)' }} />
                                        </div>
                                        <h3 style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>{liveAgentsCount} Online</h3>
                                        <p style={{ fontSize: '11px', color: 'var(--success)' }}>● 9 Lagos | 2 Abuja trunk active</p>
                                    </div>

                                    <div className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Service Levels SLA</span>
                                            <TrendingUp size={16} style={{ color: 'var(--success)' }} />
                                        </div>
                                        <h3 style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>99.2% Target</h3>
                                        <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>National standard completion rate</p>
                                    </div>
                                </div>

                                <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
                                    <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FileText size={18} /> Historical CDR (Call Detail Record) Log
                                    </h3>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-tertiary)' }}>
                                                <th style={{ padding: '10px' }}>Contact Number</th>
                                                <th style={{ padding: '10px' }}>Hold duration</th>
                                                <th style={{ padding: '10px' }}>Route queue</th>
                                                <th style={{ padding: '10px' }}>Session Time</th>
                                                <th style={{ padding: '10px', textAlign: 'right' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {liveCallLogs.map((log, index) => (
                                                <tr key={log.id || index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{log.number}</td>
                                                    <td style={{ padding: '10px', fontFamily: 'var(--mono)' }}>{log.duration}</td>
                                                    <td style={{ padding: '10px' }}>{log.route}</td>
                                                    <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{log.time}</td>
                                                    <td style={{ padding: '10px', textAlign: 'right', color: log.status.startsWith('GSM') ? 'var(--warning)' : 'var(--success)' }}>
                                                        {log.status}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </main>

                    {/* Right Call control bar & Visual softphone */}
                    <aside className="console-callbar">
                        {/* Softphone Dialer Interface */}
                        <div>
                            <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '1px', marginBottom: '14px' }}>
                                Softphone Keypad
                            </h4>

                            <div className="dialer-screen">
                                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>OUTBOUND CALL ID</div>
                                <div className="dialer-number">{dialNumber || "Enter number..."}</div>
                            </div>

                            <div className="dialer-grid">
                                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                                    <button
                                        key={digit}
                                        className="dialpad-btn"
                                        onClick={() => handleKeypadClick(digit)}
                                        disabled={callState !== 'idle'}
                                    >
                                        {digit}
                                        <span>
                                            {digit === '1' && ' '}
                                            {digit === '2' && 'abc'}
                                            {digit === '3' && 'def'}
                                            {digit === '4' && 'ghi'}
                                            {digit === '5' && 'jkl'}
                                            {digit === '6' && 'mno'}
                                            {digit === '7' && 'pqrs'}
                                            {digit === '8' && 'tuv'}
                                            {digit === '9' && 'wxyz'}
                                            {digit === '0' && '+'}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {callState === 'idle' ? (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        className="btn-primary"
                                        style={{ flex: 1, background: 'var(--success)', justifyContent: 'center' }}
                                        onClick={handleDialOutbound}
                                        disabled={!dialNumber}
                                    >
                                        <Phone size={16} /> Call Out
                                    </button>
                                    <button
                                        className="btn-secondary"
                                        style={{ padding: '10px' }}
                                        onClick={handleClearDigit}
                                        disabled={!dialNumber}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <button
                                        className="btn-primary"
                                        style={{
                                            background: 'var(--warning)',
                                            justifyContent: 'center',
                                            boxShadow: callState === 'held' ? '0 0 10px var(--warning)' : 'none'
                                        }}
                                        onClick={handleToggleHold}
                                        disabled={callState === 'calling' || callState === 'wrapup'}
                                    >
                                        <Volume2 size={16} /> {callState === 'held' ? "Resume Line" : "Hold Conversation"}
                                    </button>

                                    <button
                                        className="btn-primary"
                                        style={{ background: 'var(--danger)', justifyContent: 'center', boxShadow: 'none' }}
                                        onClick={handleEndCall}
                                    >
                                        <PhoneOff size={16} /> Disconnect
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Quick settings stats links */}
                        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                <span>Agent Account Desk:</span>
                                <strong>Superv_NGA_08</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                                <span>Telecom Terminal:</span>
                                <span style={{ color: 'var(--success)' }}>Connected</span>
                            </div>

                            <button
                                className="btn-secondary"
                                style={{ width: '100%', marginTop: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                onClick={onBackToLanding}
                            >
                                <Monitor size={14} /> Back to Landing Page
                            </button>
                        </div>
                    </aside>
                </div>
            </span>
        </div>
    );
};

// Sub-component badge icon helper
const IconBadge: React.FC<{ icon: React.ComponentType<any> }> = ({ icon: Icon }) => (
    <div style={{
        width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(10, 132, 255, 0.1)',
        color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
    }}>
        <Icon size={28} />
    </div>
);

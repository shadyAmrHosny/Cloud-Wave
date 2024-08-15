import { useEffect, useRef, useState } from "react";
import Cont from "./Cont";
import Footer from "../components/Footer";
import axios from "axios";
import SignOut from "../components/SignOut";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { useNavigate } from "react-router-dom";

function AppLogs() {
  const terminalRef = useRef(null);
  const navigate = useNavigate();
  const tokenId = localStorage.getItem("appId");
  const [apps, setApps] = useState(null); // Initialize as null or an empty object
  const [logg, setLogg] = useState(true);
  const [term, setTerm] = useState(false);
  const logsElem = useRef(null);

  const handleTerminal = () => {
    setLogg(false);
    setTerm(true);
  };

  const handleLogg = () => {
    setTerm(false);
    setLogg(true);
  };

  const fetchAppInfo = async () => {
    try {
      const response = await axios.get(
          `https://cloud.dev/api/applications/management/${tokenId}`
      );
      console.log("Application found:", response.data);
      setApps(response.data);
    } catch (error) {
      console.error("Failed to fetch Applications:", error);
    }
  };

  useEffect(() => {
    if (terminalRef.current && term) {
      const terminal = new Terminal();
      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);
      terminal.open(terminalRef.current);
      fitAddon.fit();

      const ws = new WebSocket(
          `https://cloud.dev/api/applications/management/exec/${tokenId}`
      );

      ws.onopen = () => {
        console.log("WebSocket connection opened");
      };

      ws.onmessage = (event) => {
        terminal.write(event.data);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      return () => {
        ws.close();
        terminal.dispose();
      };
    }
  }, [term]);

  useEffect(() => {
    if (!tokenId) return;

    const connectToLogs = () => {
      const url = `https://cloud.dev/api/applications/management/logs/${tokenId}`; // Replace with your actual endpoint

      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        const logLine = event.data.trim();
        if (logsElem.current) {
          logsElem.current.innerHTML += logLine + "\n";
          logsElem.current.scrollTop = logsElem.current.scrollHeight; // Scroll to bottom
        }
      };

      eventSource.onerror = (err) => {
        console.error("EventSource error:", err);
        eventSource.close();
        if (logsElem.current) {
          logsElem.current.innerHTML += "Error fetching logs.\n";
        }
      };
    };

    fetchAppInfo();
    connectToLogs();
  }, [tokenId]);

  return (
      <div className="flex w-screen h-screen text-white bg-[#041b4d]">
        <div className="flex flex-col w-[220px] border-r border-gray-800">
          <Cont />
        </div>
        <div className="flex flex-col flex-grow bg-white text-black">
          <div className="flex items-center justify-between flex-shrink-0 h-16 px-8 border-b border-gray-500">
            <h1 className="text-2xl font-bold">Web Service</h1>
            <button className="relative flex flex-row gap-2 text-center right-24 items-center text-sm focus:outline-none group">
              <div className="text-lg font-semibold text-[#041b4d] opacity-90">
                MY Account
              </div>
              <div className="flex w-8 h-8 rounded-full border bg-[#071952] rounded hover:bg-[#041b4d] hover:text-white">
                <div className="font-medium text-white text-center items-center m-auto">
                  CV
                </div>
              </div>
              <div className="absolute w-[200px] border rounded border-solid border-black z-10  top-[55px] flex-col right-[2px]  items-start hidden pb-1 bg-white shadow-lg group-focus:flex">
                <div
                    onClick={() => navigate("/profile")}
                    className="w-full font-semibold px-4 py-2 text-left hover:bg-gray-200"
                >
                  Profile
                </div>
                <SignOut />
              </div>
            </button>
          </div>
          <div className="flex-grow p-6 overflow-auto bg-white">
            <div className="flex flex-col">
              {apps && ( // Check if apps is not null before rendering
                  <>
                    <div>
                      <p className="font-semibold text-3xl px-2 mt-2 text-[#041b4d] opacity-90">
                        {apps.applicationName}
                      </p>
                      <p className="font-thick text-sm px-4 opacity-75">
                        {apps.host}
                      </p>
                    </div>
                    <div className="flex flex-col w-11/12 m-auto font-bold px-2">
                      <div className="flex flex-row justify-between items-center border-b py-2 border-solid border-black">
                        <div className="w-1/3">Status</div>
                        <div className="w-1/4">Host</div>
                        <div className="w-1/4">Plan</div>
                        <div className="w-1/4">Last deployment</div>
                        <div className="w-1/4"></div>
                      </div>
                      <div className="flex flex-row justify-between items-center font-semibold py-2">
                        <div className="w-1/3">{apps.status}</div>
                        <div className="w-1/4">{apps.host}</div>
                        <div className="w-1/4">{apps.plan}</div>
                        <div className="w-1/4">{apps.lastDeployment}</div>
                        <div className="w-1/4"></div>
                      </div>
                    </div>
                  </>
              )}
              <div className="flex flex-col w-[1000px] ml-24">
                <div className="flex flex-row items-center bg-white w-full text-black text-center justify-start py-2 gap-5 border border-b-0 border-solid border-gray-300">
                  <button
                      onClick={handleLogg}
                      className="cursor-pointer hover:bg-black-600 border-r-2 py-2 border-solid border-white hover:text-black w-1/6"
                  >
                    Logs
                  </button>
                  <button
                      onClick={handleTerminal}
                      className="cursor-pointer hover:bg-gray-300 py-2 hover:text-black w-1/6"
                  >
                    Terminal
                  </button>
                </div>
                <div className="bg-black w-[1000px] m-auto text-gray-300 text-md font-semibold rounded-t-none  border rounded scroll-smooth h-[70vh] overflow-auto ">
                  {logg && (
                      <pre id="logs" ref={logsElem}></pre>

                  )}
                  {term && (
                      <div
                          id="terminal"
                          ref={terminalRef}
                          className="terminal-container"
                      >
                        {/* Terminal content */}
                      </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
  );
}

export default AppLogs;

import { motion } from "framer-motion";
import {
  Loader2,
  AlertTriangle,
  Building,
  Car,
  BadgeCheck,
  Compass,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { PartnerNavbar } from "../../../components/layout/PartnerNavbar";
import { usePartnerDashboard } from "../hooks/usePartnerDashboard";
import { PartnerMetricsCards } from "./PartnerMetricsCards";
import { PartnerTabSelector } from "./PartnerTabSelector";
import { PartnerListingsTable } from "./PartnerListingsTable";
import { PartnerReservationsTable } from "./PartnerReservationsTable";
import { HotelEditorModal } from "./HotelEditorModal";
import { VehicleEditorModal } from "./VehicleEditorModal";

const panelClass =
  "rounded-[2rem] border border-white/10 bg-white/[0.92] shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl";

const accentPresets = {
  emerald: {
    gradient: "from-emerald-500/15 via-teal-500/10 to-cyan-500/0",
    ring: "ring-emerald-500/30",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-100",
    button: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20",
    dot: "bg-emerald-500",
  },
  sky: {
    gradient: "from-sky-500/15 via-blue-500/10 to-indigo-500/0",
    ring: "ring-sky-500/30",
    text: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-100",
    chip: "bg-sky-50 text-sky-700 border-sky-100",
    button: "bg-sky-600 hover:bg-sky-700 shadow-sky-600/20",
    dot: "bg-sky-500",
  },
} as const;

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function PartnerDashboardView() {
  const d = usePartnerDashboard();

  if (d.sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
      </div>
    );
  }

  if (!d.userRole || !["hotel", "car", "agency", "admin"].includes(d.userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-150 shadow-sm text-center max-w-sm">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-500 text-sm mb-6">
            Your profile is not registered as an authorized partner account.
          </p>
          <a
            href="/"
            className="inline-flex px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl text-sm"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  const isHotelView = d.userRole === "hotel" || (d.userRole === "admin" && d.activeWorkspace === "hotel");
  const accent = isHotelView ? accentPresets.emerald : accentPresets.sky;
  const workspaceTitle = isHotelView ? "Hotel Property Manager" : "Car Rental Fleet Manager";
  const workspaceSubtitle = isHotelView
    ? "Curate polished stays, tune nightly pricing, and manage reservation flow from one elevated workspace."
    : "Shape a fleet showcase, refine rental rules, and keep every trip request moving smoothly.";
  const primaryCtaLabel = isHotelView ? "Register a Hotel" : "List a Vehicle";
  const secondaryCtaLabel = "Review Reservations";
  const activeInventoryCount = isHotelView ? d.hotels.length : d.vehicles.length;
  const activeInventoryLabel = isHotelView ? "Listings live" : "Vehicles live";
  const primaryTabLabel = isHotelView ? "My Hotels" : "My Fleet";
  const primaryTabCount = isHotelView ? d.hotels.length : d.vehicles.length;

  const confirmedBookings = d.bookings.filter((b) => b.status === "Confirmed").length;
  const pendingBookings = d.bookings.filter((b) => b.status === "Pending").length;
  const totalEarnings = d.bookings
    .filter((b) => b.status === "Confirmed")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(59,130,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_26%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-40" />
      <PartnerNavbar />

      <main className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {d.userRole === "admin" && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${panelClass} overflow-hidden`}
          >
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">
                  Admin Workspace View
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Switch between hospitality and mobility with a single click.
                </div>
              </div>
              <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1">
                <button
                  onClick={() => {
                    d.setActiveWorkspace("hotel");
                    d.setActiveTab("hotels");
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
                    d.activeWorkspace === "hotel"
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Building className="h-3.5 w-3.5" />
                  Hotel Manager
                </button>
                <button
                  onClick={() => {
                    d.setActiveWorkspace("car");
                    d.setActiveTab("vehicles");
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
                    d.activeWorkspace === "car"
                      ? "bg-white text-sky-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Car className="h-3.5 w-3.5" />
                  Car Rental Manager
                </button>
              </div>
            </div>
          </motion.section>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className={`relative overflow-hidden ${panelClass}`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${accent.gradient}`} />
          <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full bg-white/70 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-slate-900/5 blur-3xl" />

          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.3fr_0.9fr] lg:p-10">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] ${accent.chip}`}
                >
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Partner Command Center
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  <Compass className="h-3.5 w-3.5" />
                  {d.userRole}
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                  {workspaceTitle}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:lg">
                  {workspaceSubtitle}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={isHotelView ? d.openAddHotelModal : d.openAddVehicleModal}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 ${accent.button}`}
                >
                  <Plus className="h-4 w-4" />
                  {primaryCtaLabel}
                </button>
                <button
                  onClick={() => d.setActiveTab("reservations")}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-white"
                >
                  {secondaryCtaLabel}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/70 bg-white/85 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">
                    {activeInventoryLabel}
                  </div>
                  <div className={`mt-2 text-3xl font-black ${accent.text}`}>
                    {activeInventoryCount}
                  </div>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white/85 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">
                    Reservations
                  </div>
                  <div className="mt-2 text-3xl font-black text-slate-900">{d.bookings.length}</div>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white/85 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">
                    Fast actions
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-700">
                    Update, confirm, and keep the queue moving
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid gap-4">
                <div className="rounded-[1.75rem] border border-white/70 bg-slate-950 p-5 text-white shadow-2xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.28em] text-white/55">
                        Workspace Snapshot
                      </div>
                      <div className="mt-2 text-2xl font-black">
                        {d.activeTab === "reservations" ? "Reservation flow" : primaryTabLabel}
                      </div>
                    </div>
                    <div
                      className={`rounded-2xl px-3 py-2 text-xs font-black uppercase tracking-[0.2em] ${accent.bg} ${accent.text}`}
                    >
                      Live
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-white/8 p-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
                        Inventory
                      </div>
                      <div className="mt-2 text-2xl font-black">{primaryTabCount}</div>
                    </div>
                    <div className="rounded-2xl bg-white/8 p-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
                        Confirmed
                      </div>
                      <div className="mt-2 text-2xl font-black">{confirmedBookings}</div>
                    </div>
                    <div className="rounded-2xl bg-white/8 p-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
                        Pending
                      </div>
                      <div className="mt-2 text-2xl font-black">{pendingBookings}</div>
                    </div>
                    <div className="rounded-2xl bg-white/8 p-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
                        Earnings
                      </div>
                      <div className="mt-2 text-2xl font-black">{formatMoney(totalEarnings)}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent.bg} ${accent.text}`}
                    >
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900">Refined partner experience</div>
                      <div className="text-sm text-slate-500">
                        Clear actions, calmer hierarchy, and stronger visual rhythm.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Metric Cards */}
        <PartnerMetricsCards bookings={d.bookings} accent={accent} />

        {/* Main Content Workspace */}
        <section className="flex flex-col gap-4">
          <PartnerTabSelector
            activeTab={d.activeTab}
            onTabChange={d.setActiveTab}
            isHotelView={isHotelView}
            primaryTabLabel={primaryTabLabel}
            primaryTabCount={primaryTabCount}
            reservationsCount={d.bookings.length}
            primaryCtaLabel={primaryCtaLabel}
            onAddClick={isHotelView ? d.openAddHotelModal : d.openAddVehicleModal}
            accentButton={accent.button}
          />

          {d.loading ? (
            <div className={`${panelClass} flex items-center justify-center py-24`}>
              <Loader2 className={`h-10 w-10 animate-spin ${accent.text}`} />
            </div>
          ) : d.activeTab === "reservations" ? (
            <PartnerReservationsTable
              isHotelView={isHotelView}
              bookings={d.bookings}
              hotels={d.hotels}
              vehicles={d.vehicles}
              accent={accent}
              onUpdateBookingStatus={d.handleUpdateBookingStatus}
            />
          ) : (
            <PartnerListingsTable
              isHotelView={isHotelView}
              hotels={d.hotels}
              vehicles={d.vehicles}
              accent={accent}
              onAddHotel={d.openAddHotelModal}
              onEditHotel={d.openEditHotelModal}
              onDeleteHotel={d.handleHotelDelete}
              onAddVehicle={d.openAddVehicleModal}
              onEditVehicle={d.openEditVehicleModal}
              onDeleteVehicle={d.handleVehicleDelete}
            />
          )}
        </section>

        {/* Hotel Editor Modal */}
        <HotelEditorModal
          isOpen={d.isHotelModalOpen}
          onClose={() => d.setIsHotelModalOpen(false)}
          editHotel={d.editHotel}
          formData={d.hotelFormData}
          onFormChange={d.handleHotelFormChange}
          onCoordinateChange={d.handleCoordinateChange}
          newRoom={d.newRoom}
          setNewRoom={d.setNewRoom}
          onAddRoomType={d.addRoomType}
          onRemoveRoomType={d.removeRoomType}
          onSubmit={d.handleHotelSubmit}
          accentButton={accent.button}
        />

        {/* Vehicle Editor Modal */}
        <VehicleEditorModal
          isOpen={d.isVehicleModalOpen}
          onClose={() => d.setIsVehicleModalOpen(false)}
          editVehicle={d.editVehicle}
          formData={d.vehicleFormData}
          onFormChange={d.handleVehicleFormChange}
          onSubmit={d.handleVehicleSubmit}
        />
      </main>
    </div>
  );
}

import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAdminCatalog } from "../features/admin/hooks/useAdminCatalog";
import { AdminStatsCards } from "../features/admin/components/AdminStatsCards";
import { AdminTabSelector } from "../features/admin/components/AdminTabSelector";
import { CatalogDataTable } from "../features/admin/components/CatalogDataTable";
import { EntityEditorModal } from "../features/admin/components/EntityEditorModal";

export function AdminDashboard() {
  const {
    activeTab,
    setActiveTab,
    heritages,
    cultures,
    hotels,
    vehicles,
    loading,
    isModalOpen,
    setIsModalOpen,
    editItem,
    formData,
    setFormData,
    handleDelete,
    openAddModal,
    openEditModal,
    handleSubmit,
    getActiveList,
  } = useAdminCatalog();

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-gray-950 flex items-center gap-2">
                TravelAssist{" "}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 font-extrabold border border-green-200">
                  ADMIN
                </span>
              </h1>
              <p className="text-xs text-gray-500">Manage catalog and items dynamically</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Quick Statistics */}
        <AdminStatsCards
          heritagesCount={heritages.length}
          culturesCount={cultures.length}
          hotelsCount={hotels.length}
          vehiclesCount={vehicles.length}
        />

        {/* Catalog Control Area */}
        <section className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
          {/* Tabs and Actions Header */}
          <AdminTabSelector
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddClick={openAddModal}
          />

          {/* Active Tab Panel Content */}
          <div className="p-0">
            <CatalogDataTable
              activeTab={activeTab}
              items={getActiveList()}
              loading={loading}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          </div>
        </section>
      </main>

      {/* Unified Add/Edit Form Modal */}
      <EntityEditorModal
        isOpen={isModalOpen}
        activeTab={activeTab}
        editItem={editItem}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

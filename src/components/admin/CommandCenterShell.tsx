'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { PasskeyGateway } from './PasskeyGateway';
import { CommandSidebar } from './CommandSidebar';
import { CommandTopbar } from './CommandTopbar';
import { GlobalSearchModal } from './GlobalSearchModal';
import { OverviewSection } from './OverviewSection';
import { QuestionBankSection } from './QuestionBankSection';
import { ResourceLibrarySection } from './ResourceLibrarySection';
import { AssignmentsSection } from './AssignmentsSection';
import { ClassroomsAndGroupsSection } from './ClassroomsAndGroupsSection';
import { ConnectionsSection } from './ConnectionsSection';
import { AdminAnalyticsSection } from './AdminAnalyticsSection';
import { CommandSettingsSection } from './CommandSettingsSection';
import { UserRoleManagementSection } from './UserRoleManagementSection';
import { LoginActivitySection } from './LoginActivitySection';
import { LiveProctoringSection } from './LiveProctoringSection';
import { TeacherVerificationCenter } from '@/components/teacher/TeacherVerificationCenter';
import { useRouter, useSearchParams } from 'next/navigation';
import { SuperAdminOverviewSection } from './super-admin/SuperAdminOverviewSection';
import { AllExaminationsSection } from './super-admin/AllExaminationsSection';
import { ExaminationDetailDrawer } from './super-admin/ExaminationDetailDrawer';
import { TeacherDirectorySection } from './super-admin/TeacherDirectorySection';
import { TeacherCommunicationCenter } from './super-admin/TeacherCommunicationCenter';
import { ExaminationIssueTracker } from './super-admin/ExaminationIssueTracker';
import { StudentIntelligenceSection } from './super-admin/StudentIntelligenceSection';
import { SuperAdminSupervisionHub } from './super-admin/SuperAdminSupervisionHub';
import { CreateCustomExamModal } from '@/components/custom-exams/CreateCustomExamModal';
import type {
  AdminOverviewPayload,
  AdminSectionId,
  ClassroomItem,
  CommandRole,
  StudentGroupItem,
  PlatformExamSummary,
} from '@/types/admin';

interface AuthStatusResponse {
  authenticated: boolean;
  unlocked: boolean;
  role: CommandRole;
  accountStatus: 'active' | 'suspended' | 'archived';
  passkeyConfigured: boolean;
  schemaReady: boolean;
  hasServiceRole: boolean;
  expiresAt: string | null;
  isTeacherVerified?: boolean;
  teacherVerificationStatus?: 'verified' | 'pending' | 'unverified';
  identity: {
    userId: string;
    email: string | null;
    publicId: string;
    username: string | null;
    fullName: string | null;
    avatarUrl: string | null;
    discoverable: boolean;
  } | null;
}

export function CommandCenterShell() {
  const [authStatus, setAuthStatus] = useState<AuthStatusResponse | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bootLoading, setBootLoading] = useState(true);

  const [activeSection, setActiveSection] = useState<AdminSectionId>('overview');

  useEffect(() => {
    const sec = searchParams.get('section') as AdminSectionId | null;
    if (sec) {
      setActiveSection(sec);
    }
  }, [searchParams]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [overview, setOverview] = useState<AdminOverviewPayload | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [classrooms, setClassrooms] = useState<ClassroomItem[]>([]);
  const [groups, setGroups] = useState<StudentGroupItem[]>([]);
  const [pendingConnCount, setPendingConnCount] = useState(0);

  const [openQuestionComposer, setOpenQuestionComposer] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);

  // Super Admin Command Center States
  const [selectedExamDetail, setSelectedExamDetail] = useState<PlatformExamSummary | null>(null);
  const [noticeRecipient, setNoticeRecipient] = useState<{
    email: string;
    name?: string;
    examId?: string;
    examCode?: string;
  } | null>(null);
  const [openCreateExamModal, setOpenCreateExamModal] = useState(false);

  const handleEnterExamRoom = (examId: string, examCode?: string) => {
    router.push(`/teacher/supervise/${examId}?code=${examCode || ''}&super_admin=true`);
  };

  const handleContactTeacher = (
    email: string,
    name?: string,
    examId?: string,
    examCode?: string
  ) => {
    setNoticeRecipient({ email, name, examId, examCode });
    setActiveSection('super_admin_communications');
  };

  const loadAuthStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/auth/status');
      if (res.ok) {
        const data = (await res.json()) as AuthStatusResponse;
        setAuthStatus(data);
        if (data.role === 'teacher' && !data.isTeacherVerified) {
          setActiveSection('teacher_verify');
        }
      }
    } finally {
      setBootLoading(false);
    }
  }, []);

  const loadWorkspaceData = useCallback(async () => {
    setOverviewLoading(true);
    try {
      const [ovRes, clsRes, grpRes] = await Promise.all([
        fetch('/api/admin/overview'),
        fetch('/api/admin/classrooms'),
        fetch('/api/admin/groups'),
      ]);
      if (ovRes.ok) {
        const ovData = (await ovRes.json()) as AdminOverviewPayload;
        setOverview(ovData);
        setPendingConnCount(ovData.stats.pending_connections || 0);
      }
      if (clsRes.ok) {
        const clsData = (await clsRes.json()) as { items?: ClassroomItem[] };
        setClassrooms(clsData.items || []);
      }
      if (grpRes.ok) {
        const grpData = (await grpRes.json()) as { items?: StudentGroupItem[] };
        setGroups(grpData.items || []);
      }
    } finally {
      setOverviewLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      void loadAuthStatus();
    });
  }, [loadAuthStatus]);

  useEffect(() => {
    if (authStatus?.unlocked) {
      Promise.resolve().then(() => {
        void loadWorkspaceData();
      });
    }
  }, [authStatus?.unlocked, loadWorkspaceData]);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (authStatus?.unlocked) {
          setSearchOpen((v) => !v);
        }
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [authStatus?.unlocked]);

  async function handleLockSession() {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    setOverview(null);
    await loadAuthStatus();
  }

  async function handleMarkNotificationsRead() {
    await fetch('/api/admin/overview', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAll: true }),
    });
    await loadWorkspaceData();
  }

  if (bootLoading || !authStatus) {
    return (
      <div className="min-h-screen w-full bg-[#F7F6FC] dark:bg-[#0B1120] flex items-center justify-center p-6">
        <div className="rounded-3xl bg-white dark:bg-[#111A2E] px-8 py-6 shadow-xl flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-[#6D28D9] animate-spin" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Verifying SamayYudh Command Clearance...
          </span>
        </div>
      </div>
    );
  }

  if (!authStatus.unlocked) {
    return (
      <PasskeyGateway
        role={authStatus.role}
        accountStatus={authStatus.accountStatus}
        passkeyConfigured={authStatus.passkeyConfigured}
        userEmail={authStatus.identity?.email ?? null}
        fullName={authStatus.identity?.fullName ?? null}
        publicId={authStatus.identity?.publicId ?? null}
        isTeacherVerified={authStatus.isTeacherVerified}
        teacherVerificationStatus={authStatus.teacherVerificationStatus}
        onUnlocked={loadAuthStatus}
        onRoleChanged={loadAuthStatus}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F7F6FC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 transition-colors flex items-start">
      <CommandSidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        mobileOpen={mobileMenuOpen}
        onOpenMobile={() => setMobileMenuOpen(true)}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onLockSession={handleLockSession}
        pendingRequestsCount={pendingConnCount}
        role={authStatus.role}
        fullName={authStatus.identity?.fullName ?? null}
        isTeacherVerified={authStatus.isTeacherVerified}
      />

      {/* Reserved flow spacer matching the fixed vertical navbar width so content never overlaps */}
      <div
        aria-hidden="true"
        className="hidden md:block shrink-0 transition-[width] duration-300 ease-out"
        style={{ width: sidebarCollapsed ? 92 : 256 }}
      />
      <div aria-hidden="true" className="md:hidden shrink-0 w-[60px]" />

      <div className="flex-1 min-w-0">
        <main className="w-full max-w-[1440px] mx-auto px-2.5 sm:px-6 pt-3 sm:pt-6 pb-28 md:pb-16 space-y-4 sm:space-y-5">
          <CommandTopbar
            activeSection={activeSection}
            role={authStatus.role}
            publicId={authStatus.identity?.publicId ?? null}
            notifications={overview?.notifications || []}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onOpenSearch={() => setSearchOpen(true)}
            onQuickUpload={() => {
              setActiveSection('resources');
              setOpenUploadModal(true);
            }}
            onMarkNotificationsRead={handleMarkNotificationsRead}
            onNavigate={setActiveSection}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
            >
              {activeSection === 'overview' && (
                <OverviewSection
                  overview={overview}
                  loading={overviewLoading}
                  onNavigate={setActiveSection}
                  onOpenNewQuestion={() => {
                    setActiveSection('questions');
                    setOpenQuestionComposer(true);
                  }}
                  onOpenUploadResource={() => {
                    setActiveSection('resources');
                    setOpenUploadModal(true);
                  }}
                />
              )}

              {/* Super Admin Examination Command Center Sections */}
              {activeSection === 'super_admin_overview' && (
                <SuperAdminOverviewSection
                  onNavigate={setActiveSection}
                  onEnterExamRoom={handleEnterExamRoom}
                  onOpenExamDetail={(exam) => setSelectedExamDetail(exam)}
                  onOpenNewExam={() => setOpenCreateExamModal(true)}
                />
              )}

              {activeSection === 'super_admin_exams' && (
                <AllExaminationsSection
                  onEnterExamRoom={handleEnterExamRoom}
                  onOpenExamDetail={(exam) => setSelectedExamDetail(exam)}
                  onContactTeacher={handleContactTeacher}
                  onOpenNewExam={() => setOpenCreateExamModal(true)}
                />
              )}

              {activeSection === 'super_admin_supervision' && (
                <SuperAdminSupervisionHub
                  onEnterExamRoom={handleEnterExamRoom}
                  onOpenExamDetail={(exam) => setSelectedExamDetail(exam)}
                />
              )}

              {activeSection === 'super_admin_teachers' && (
                <TeacherDirectorySection
                  onContactTeacher={(email, name) => handleContactTeacher(email, name)}
                  onViewTeacherExams={() => {
                    setActiveSection('super_admin_exams');
                  }}
                />
              )}

              {activeSection === 'super_admin_students' && (
                <StudentIntelligenceSection />
              )}

              {activeSection === 'super_admin_communications' && (
                <TeacherCommunicationCenter initialRecipient={noticeRecipient} />
              )}

              {activeSection === 'super_admin_issues' && (
                <ExaminationIssueTracker />
              )}

              {activeSection === 'live_proctoring' && (
                <LiveProctoringSection
                  currentUserId={authStatus.identity?.userId}
                  role={authStatus.role}
                />
              )}

              {activeSection === 'teacher_verify' && (
                <div className="space-y-4">
                  <TeacherVerificationCenter
                    embedded
                    onVerified={loadAuthStatus}
                    onSwitchToStudent={async () => {
                      await loadAuthStatus();
                    }}
                  />
                </div>
              )}

              {activeSection === 'user_management' && (
                <UserRoleManagementSection />
              )}

              {activeSection === 'login_activity' && (
                <LoginActivitySection />
              )}

              {activeSection === 'questions' && (
                <QuestionBankSection
                  externalOpenComposer={openQuestionComposer}
                  onComposerOpened={() => setOpenQuestionComposer(false)}
                />
              )}

              {activeSection === 'resources' && (
                <ResourceLibrarySection
                  classrooms={classrooms}
                  groups={groups}
                  externalOpenUpload={openUploadModal}
                  onUploadOpened={() => setOpenUploadModal(false)}
                />
              )}

              {activeSection === 'assignments' && (
                <AssignmentsSection classrooms={classrooms} groups={groups} />
              )}

              {activeSection === 'classrooms' && (
                <ClassroomsAndGroupsSection
                  classrooms={classrooms}
                  groups={groups}
                  onRefresh={loadWorkspaceData}
                />
              )}

              {activeSection === 'students' && (
                <UserRoleManagementSection />
              )}

              {activeSection === 'connections' && (
                <ConnectionsSection onPendingCountChange={setPendingConnCount} />
              )}

              {activeSection === 'analytics' && (
                <AdminAnalyticsSection overview={overview} />
              )}

              {activeSection === 'settings' && (
                <CommandSettingsSection
                  role={authStatus.role}
                  publicId={authStatus.identity?.publicId ?? null}
                  username={authStatus.identity?.username ?? null}
                  discoverable={authStatus.identity?.discoverable ?? true}
                  expiresAt={authStatus.expiresAt}
                  overview={overview}
                  onLockSession={handleLockSession}
                  onRefreshAuth={loadAuthStatus}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <GlobalSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={setActiveSection}
      />

      {/* Examination Detail Drawer */}
      <ExaminationDetailDrawer
        isOpen={Boolean(selectedExamDetail)}
        exam={selectedExamDetail}
        onClose={() => setSelectedExamDetail(null)}
        onEnterExamRoom={handleEnterExamRoom}
        onContactTeacher={handleContactTeacher}
      />

      {/* Super Admin Create Custom Exam Modal */}
      <CreateCustomExamModal
        isOpen={openCreateExamModal}
        onClose={() => setOpenCreateExamModal(false)}
        onCreated={(exam) => {
          setOpenCreateExamModal(false);
          if (exam && (exam.id || exam.exam_code)) {
            handleEnterExamRoom(exam.id, exam.exam_code);
          } else {
            setActiveSection('super_admin_exams');
          }
        }}
      />
    </div>
  );
}

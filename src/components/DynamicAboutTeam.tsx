import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Star,
  Linkedin,
  Twitter
} from 'lucide-react';

export const DynamicAboutTeam: React.FC = () => {
  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['team-members-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Meet Our <span className="text-primary">Team</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-80 animate-pulse">
                <CardContent className="pt-6">
                  <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="h-16 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (teamMembers.length === 0) {
    return null; // Don't show the section if no team members
  }

  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">Our Team</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Meet the <span className="text-primary">Experts</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Behind ShineVeda's success is a dedicated team of professionals committed to 
            delivering excellence in agricultural exports
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                <CardContent className="pt-6 text-center">
                  <div className="relative mb-4">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-background shadow-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border-4 border-background shadow-lg">
                        <User className="w-8 h-8 text-primary" />
                      </div>
                    )}
                    {member.is_featured && (
                      <Badge 
                        variant="default" 
                        className="absolute -top-2 -right-2 flex items-center gap-1"
                      >
                        <Star className="w-3 h-3" />
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.position}</p>
                  
                  {member.department && (
                    <Badge variant="outline" className="mb-3">
                      {member.department}
                    </Badge>
                  )}

                  {member.bio && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {member.bio}
                    </p>
                  )}

                  {member.years_experience && (
                    <div className="flex items-center justify-center gap-1 mb-3 text-sm text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      <span>{member.years_experience} years experience</span>
                    </div>
                  )}

                  {member.location && (
                    <div className="flex items-center justify-center gap-1 mb-4 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{member.location}</span>
                    </div>
                  )}

                  {member.specializations && member.specializations.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {member.specializations.slice(0, 2).map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {member.specializations.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{member.specializations.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center gap-2">
                    {member.email && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <a href={`mailto:${member.email}`}>
                          <Mail className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    
                    {member.linkedin_url && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </Button>
                    )}

                    {member.twitter_url && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <a href={member.twitter_url} target="_blank" rel="noopener noreferrer">
                          <Twitter className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};